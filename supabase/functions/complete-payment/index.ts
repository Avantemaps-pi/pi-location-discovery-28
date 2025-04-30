import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface PaymentRequest {
  paymentId: string;
  userId: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  txid: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  txid?: string;
}

// Create a Supabase client with the Auth context of the function
const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
);

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  try {
    // Get request body
    const paymentRequest: PaymentRequest = await req.json();
    
    // Log the request for debugging
    console.log('Payment completion request received:', paymentRequest);
    
    // Validate the request
    if (!paymentRequest.paymentId || !paymentRequest.txid) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing payment ID or transaction ID' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get Pi Network API key from Supabase secrets
    const piApiKey = Deno.env.get('PI_API_KEY');
    
    if (!piApiKey) {
      console.error('PI_API_KEY not configured in Supabase secrets');
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment service not properly configured' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // First update the payment in the database
    const { data, error } = await supabaseClient
      .from('payments')
      .update({
        txid: paymentRequest.txid,
        status: {
          approved: true,
          verified: true,
          completed: true,
          cancelled: false
        },
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', paymentRequest.paymentId)
      .select()
      .single();
      
    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Database error: ${error.message}`,
          paymentId: paymentRequest.paymentId,
          txid: paymentRequest.txid
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Call the Pi Network API to complete the payment
    try {
      // Determine the correct endpoint based on environment variables
      const isTestnet = Deno.env.get('IS_TESTNET') === 'true';
      const piNetworkApiUrl = isTestnet
        ? 'https://api.testnet.minepi.com/v2/payments'
        : 'https://api.minepi.com/v2/payments';
      
      console.log('Calling Pi Network API to complete payment:', paymentRequest.paymentId);
      
      const completeResponse = await fetch(`${piNetworkApiUrl}/${paymentRequest.paymentId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          txid: paymentRequest.txid,
        })
      });
      
      const completeResult = await completeResponse.json();
      console.log('Pi Network API complete payment response:', completeResult);
      
      if (!completeResponse.ok) {
        console.error('Pi Network API error:', completeResult);
        
        // Update the payment status to reflect the error
        await supabaseClient
          .from('payments')
          .update({
            status: {
              ...data.status,
              completed: false,
              error: `Pi Network API error: ${JSON.stringify(completeResult)}`
            },
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', paymentRequest.paymentId);
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Pi Network API error: ${completeResult.message || 'Unknown error'}`,
            paymentId: paymentRequest.paymentId,
            txid: paymentRequest.txid
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
        );
      }
      
      // Payment completed successfully
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment completed successfully',
          paymentId: paymentRequest.paymentId,
          txid: paymentRequest.txid
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error('Error calling Pi Network API:', apiError);
      
      // Update the payment status to reflect the error
      await supabaseClient
        .from('payments')
        .update({
          status: {
            ...data.status,
            completed: false,
            error: `API call error: ${apiError.message}`
          },
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', paymentRequest.paymentId);
        
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Error calling Pi Network API: ${apiError.message}`,
          paymentId: paymentRequest.paymentId,
          txid: paymentRequest.txid
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }
  } catch (error) {
    console.error('Error in complete-payment function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Server error: ${error.message}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
