
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

interface PaymentStatus {
  paymentId: string;
  txid?: string;
  verified: boolean;
  completed: boolean;
  cancelled: boolean;
  error?: string;
}

interface PaymentResponse {
  success: boolean;
  message: string;
  paymentId?: string;
  txid?: string;
  status?: PaymentStatus;
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
    const { paymentId } = await req.json();
    
    // Log the request for debugging
    console.log('Payment status request received for ID:', paymentId);
    
    // Validate the request
    if (!paymentId) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Missing payment ID' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Get payment status from the database
    const { data, error } = await supabaseClient
      .from('payments')
      .select('payment_id, txid, status')
      .eq('payment_id', paymentId)
      .single();
      
    if (error) {
      console.error('Database error:', error);
      
      if (error.code === 'PGRST116') {
        // No payment found with this ID
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: 'Payment not found',
            paymentId
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Database error: ${error.message}`,
          paymentId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }
    
    if (!data) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: 'Payment not found',
          paymentId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }
    
    // Format the response
    const paymentStatus: PaymentStatus = {
      paymentId: data.payment_id,
      txid: data.txid,
      verified: data.status?.verified || false,
      completed: data.status?.completed || false,
      cancelled: data.status?.cancelled || false,
      error: data.status?.error
    };
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment status retrieved',
        paymentId,
        txid: data.txid,
        status: paymentStatus
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
