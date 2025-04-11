
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface PaymentRequest {
  paymentId: string;
  txid: string;
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
    
    // Update the payment in the database
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
    
    // In a production implementation, you would make a call to the Pi Network API
    // to complete the payment using the piApiKey
    // For now, we'll simulate a successful completion
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment completed successfully',
        paymentId: paymentRequest.paymentId,
        txid: paymentRequest.txid
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
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
