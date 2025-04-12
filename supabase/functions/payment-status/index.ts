
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface StatusRequest {
  paymentId: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  txid?: string;
  status?: {
    approved: boolean;
    verified: boolean;
    completed: boolean;
    cancelled: boolean;
    error?: string;
  };
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
    const statusRequest: StatusRequest = await req.json();
    
    // Log the request for debugging
    console.log('Payment status request received for payment ID:', statusRequest.paymentId);
    
    // Validate the request
    if (!statusRequest.paymentId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing payment ID' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get the payment from the database
    const { data, error } = await supabaseClient
      .from('payments')
      .select('*')
      .eq('payment_id', statusRequest.paymentId)
      .single();
      
    if (error) {
      console.error('Database error:', error);
      
      if (error.code === 'PGRST116') {
        // Payment not found
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Payment not found',
            paymentId: statusRequest.paymentId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Database error: ${error.message}`,
          paymentId: statusRequest.paymentId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    // Return the payment status
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment status retrieved successfully',
        paymentId: statusRequest.paymentId,
        txid: data.txid,
        status: data.status
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in payment-status function:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: `Server error: ${error.message}` 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
