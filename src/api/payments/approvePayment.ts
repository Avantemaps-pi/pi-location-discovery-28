
/**
 * Payment approval endpoint
 * 
 * This endpoint handles the approval of Pi payments by calling
 * a Supabase Edge Function that securely communicates with the Pi Network API
 */
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentResponse } from './types';

export const approvePayment = async (req: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('Calling payment approval edge function:', req.paymentId);
    
    // Call the Supabase Edge Function for payment approval
    const { data, error } = await supabase.functions.invoke('approve-payment', {
      body: JSON.stringify(req)
    });
    
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
  } catch (error) {
    console.error('Error approving payment:', error);
    return {
      success: false,
      message: 'Failed to approve payment: ' + (error instanceof Error ? error.message : 'Unknown error'),
      paymentId: req.paymentId
    };
  }
};
