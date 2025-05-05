
/**
 * Payment completion endpoint
 * 
 * This endpoint handles the completion of Pi payments by calling
 * a Supabase Edge Function that securely communicates with the Pi Network API
 */
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentResponse } from './types';

export const completePayment = async (req: PaymentRequest & { txid: string }): Promise<PaymentResponse> => {
  try {
    console.log('Calling payment completion edge function:', req.paymentId, 'with txid:', req.txid);
    
    // Call the Supabase Edge Function for payment completion with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    try {
      const { data, error } = await supabase.functions.invoke('complete-payment', {
        body: JSON.stringify(req),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
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
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('Payment completion request timed out');
        return {
          success: false,
          message: 'Payment completion timed out. Please try again.',
          paymentId: req.paymentId,
          txid: req.txid
        };
      }
      
      throw fetchError;
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
