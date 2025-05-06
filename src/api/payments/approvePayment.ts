
/**
 * Payment approval endpoint
 * 
 * This endpoint handles the approval of Pi payments by calling
 * a Supabase Edge Function that securely communicates with the Pi Network API
 * 
 * This follows Phase I of the Pi Network payment flow as described in payments.md
 */
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentResponse } from './types';

export const approvePayment = async (req: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('Calling payment approval edge function:', req.paymentId);
    
    // Call the Supabase Edge Function for payment approval with timeout handling
    const timeoutPromise = new Promise<PaymentResponse>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Payment approval request timed out'));
      }, 20000); // 20 second timeout (reduced from 30s)
    });
    
    try {
      const fetchPromise = supabase.functions.invoke('approve-payment', {
        body: JSON.stringify(req)
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error calling payment approval edge function:', error);
          return {
            success: false,
            message: `Failed to approve payment: ${error.message}`,
            paymentId: req.paymentId
          };
        }
        
        console.log('Payment approval edge function response:', data);
        return data as PaymentResponse;
      });
      
      // Race between the fetch and the timeout
      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (fetchError) {
      console.error('Error calling payment approval edge function:', fetchError);
      return {
        success: false,
        message: 'Payment approval request failed: ' + (fetchError instanceof Error ? fetchError.message : 'Unknown error'),
        paymentId: req.paymentId
      };
    }
  } catch (error) {
    console.error('Error approving payment:', error);
    return {
      success: false,
      message: 'Failed to approve payment: ' + (error instanceof Error ? error.message : 'Unknown error'),
      paymentId: req.paymentId
    };
  }
};
