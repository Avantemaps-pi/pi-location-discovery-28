
/**
 * Payment completion endpoint
 * 
 * This endpoint handles the completion of Pi payments by calling
 * a Supabase Edge Function that securely communicates with the Pi Network API
 * 
 * This follows Phase III of the Pi Network payment flow as described in payments.md
 */
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentResponse } from './types';

export const completePayment = async (req: PaymentRequest & { txid: string }): Promise<PaymentResponse> => {
  try {
    console.log('Calling payment completion edge function:', req.paymentId, 'with txid:', req.txid);
    
    // Call the Supabase Edge Function for payment completion with timeout handling
    const timeoutPromise = new Promise<PaymentResponse>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Payment completion request timed out'));
      }, 20000); // 20 second timeout (reduced from 30s)
    });
    
    try {
      const fetchPromise = supabase.functions.invoke('complete-payment', {
        body: JSON.stringify(req)
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error calling payment completion edge function:', error);
          return {
            success: false,
            message: `Failed to complete payment: ${error.message}`,
            paymentId: req.paymentId,
            txid: req.txid
          };
        }
        
        console.log('Payment completion edge function response:', data);
        return data as PaymentResponse;
      });
      
      // Race between the fetch and the timeout
      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (fetchError) {
      console.error('Error calling payment completion edge function:', fetchError);
      return {
        success: false,
        message: 'Payment completion request failed: ' + (fetchError instanceof Error ? fetchError.message : 'Unknown error'),
        paymentId: req.paymentId,
        txid: req.txid
      };
    }
  } catch (error) {
    console.error('Error completing payment:', error);
    return {
      success: false,
      message: 'Failed to complete payment: ' + (error instanceof Error ? error.message : 'Unknown error'),
      paymentId: req.paymentId,
      txid: req.txid
    };
  }
};
