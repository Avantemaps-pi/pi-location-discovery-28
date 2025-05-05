
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

// Determine subscription tier based on payment amount
function determineSubscriptionTier(amount: number, metadata: Record<string, any>): string {
  // First check if metadata explicitly defines the subscription tier
  if (metadata && metadata.subscriptionTier) {
    return metadata.subscriptionTier;
  }

  // If no explicit tier in metadata, determine based on amount
  if (amount < 1) {
    return 'individual'; // Free tier
  } else if (amount < 10) {
    return 'small-business'; // Basic tier
  } else {
    return 'organization'; // Premium tier
  }
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
  
  // Log the start time to track execution duration
  const startTime = Date.now();
  console.log(`Starting payment approval at ${new Date().toISOString()}`);
  
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

    // Check if the payment already exists in the database
    const { data: existingPayment, error: checkError } = await supabaseClient
      .from('payments')
      .select('status')
      .eq('payment_id', paymentRequest.paymentId)
      .single();

    // If payment already exists and is approved, return success immediately
    if (existingPayment?.status?.approved) {
      console.log('Payment was already approved previously:', paymentRequest.paymentId);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment was already approved',
          paymentId: paymentRequest.paymentId
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // If payment exists but isn't approved, update it instead of inserting
    if (existingPayment) {
      console.log('Payment exists but needs approval:', paymentRequest.paymentId);
    } else {
      // Record the payment in the database
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
        // If it's a unique violation, it might be a duplicate request
        if (error.code === '23505') {
          console.log('Payment already exists in database:', paymentRequest.paymentId);
        } else {
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
      }
    }
    
    // Call the Pi Network API to approve the payment
    try {
      // The Pi Network API endpoint for approving a payment
      const piNetworkApiUrl = 'https://api.minepi.com/v2/payments';
      
      console.log('Calling Pi Network API to approve payment:', paymentRequest.paymentId);
      console.log('API key used (first 4 chars):', piApiKey?.substring(0, 4));
      
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
        
        // If payment is already approved, treat as success
        if (approveResult.message && approveResult.message.includes('already approved')) {
          console.log('Payment was already approved on Pi Network side');
          
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
          
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Payment was already approved',
              paymentId: paymentRequest.paymentId
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
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
      
      // Now, update the user's subscription tier based on the payment
      const subscriptionTier = determineSubscriptionTier(
        paymentRequest.amount, 
        paymentRequest.metadata
      );
      
      console.log(`Updating user ${paymentRequest.userId} to subscription tier: ${subscriptionTier}`);
      
      // Verify if the user exists first to avoid errors
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('id, subscription')
        .eq('id', paymentRequest.userId)
        .maybeSingle();
        
      if (userError) {
        console.error('Error checking user existence:', userError);
      }
      
      // If user exists, update their subscription
      if (userData) {
        // Only update if the new tier is higher than the current one
        const shouldUpdate = !userData.subscription || 
                            (subscriptionTier === 'organization') || 
                            (subscriptionTier === 'small-business' && userData.subscription === 'individual');
        
        if (shouldUpdate) {
          const { error: updateError } = await supabaseClient
            .from('users')
            .update({ subscription: subscriptionTier })
            .eq('id', paymentRequest.userId);
            
          if (updateError) {
            console.error('Error updating user subscription:', updateError);
          } else {
            console.log(`Successfully updated user ${paymentRequest.userId} to tier ${subscriptionTier}`);
            
            // Also record the subscription in the subscriptions table for history
            const { error: subError } = await supabaseClient
              .from('subscriptions')
              .insert({
                user_id: paymentRequest.userId,
                plan: subscriptionTier,
                start_date: new Date().toISOString(),
                // If metadata has subscription duration info, calculate end date
                end_date: paymentRequest.metadata?.duration ? 
                  new Date(Date.now() + (paymentRequest.metadata.duration * 86400000)).toISOString() : 
                  null
              });
              
            if (subError) {
              console.error('Error recording subscription history:', subError);
            }
          }
        } else {
          console.log(`User already has equal or better subscription. Not downgrading.`);
        }
      } else {
        console.log(`User ${paymentRequest.userId} not found in database. Cannot update subscription.`);
      }
      
      const endTime = Date.now();
      console.log(`Payment approval completed in ${endTime - startTime}ms`);
      
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
