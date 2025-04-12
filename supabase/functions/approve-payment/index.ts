
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface PaymentRequest {
  paymentId: string;
  userId: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
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
    console.log('Payment approval request received:', paymentRequest);
    
    // Validate the request
    if (!paymentRequest.paymentId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing payment ID' 
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
    
    // First record the payment in the database
    const { data, error } = await supabaseClient
      .from('payments')
      .insert({
        payment_id: paymentRequest.paymentId,
        user_id: paymentRequest.userId,
        amount: paymentRequest.amount,
        memo: paymentRequest.memo,
        metadata: paymentRequest.metadata,
        status: {
          approved: false,
          verified: false,
          completed: false,
          cancelled: false
        }
      })
      .select()
      .single();
      
    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Database error: ${error.message}`,
          paymentId: paymentRequest.paymentId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Call the Pi Network API to approve the payment
    try {
      // The Pi Network API endpoint for approving a payment
      const piNetworkApiUrl = 'https://api.minepi.com/v2/payments';
      
      console.log('Calling Pi Network API to approve payment:', paymentRequest.paymentId);
      
      const approveResponse = await fetch(`${piNetworkApiUrl}/${paymentRequest.paymentId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${piApiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      const approveResult = await approveResponse.json();
      console.log('Pi Network API approve payment response:', approveResult);
      
      if (!approveResponse.ok) {
        console.error('Pi Network API error:', approveResult);
        
        // Update the payment status to reflect the error
        await supabaseClient
          .from('payments')
          .update({
            status: {
              approved: false,
              verified: false,
              completed: false,
              cancelled: true,
              error: `Pi Network API error: ${JSON.stringify(approveResult)}`
            },
            updated_at: new Date().toISOString()
          })
          .eq('payment_id', paymentRequest.paymentId);
          
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: `Pi Network API error: ${approveResult.message || 'Unknown error'}`,
            paymentId: paymentRequest.paymentId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
        );
      }
      
      // Update the payment status to approved
      await supabaseClient
        .from('payments')
        .update({
          status: {
            approved: true,
            verified: false,
            completed: false,
            cancelled: false
          },
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', paymentRequest.paymentId);
      
      // Payment approved successfully
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment approved successfully',
          paymentId: paymentRequest.paymentId
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
            approved: false,
            verified: false,
            completed: false,
            cancelled: true,
            error: `API call error: ${apiError.message}`
          },
          updated_at: new Date().toISOString()
        })
        .eq('payment_id', paymentRequest.paymentId);
        
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Error calling Pi Network API: ${apiError.message}`,
          paymentId: paymentRequest.paymentId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 502 }
      );
    }
  } catch (error) {
    console.error('Error in approve-payment function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Server error: ${error.message}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
