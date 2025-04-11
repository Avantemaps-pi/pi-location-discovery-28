
/**
 * Payment status endpoint
 * 
 * This endpoint retrieves the current status of a payment by calling
 * a Supabase Edge Function that securely accesses the payment database
 */
import { supabase } from '@/integrations/supabase/client';
import { PaymentResponse } from './types';

export const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  try {
    console.log('Calling payment status edge function:', paymentId);
    
    // Call the Supabase Edge Function for payment status
    const { data, error } = await supabase.functions.invoke('payment-status', {
      body: JSON.stringify({ paymentId })
    });
    
    if (error) {
      console.error('Error calling payment status edge function:', error);
      return {
        success: false,
        message: `Failed to get payment status: ${error.message}`,
        paymentId
      };
    }
    
    console.log('Payment status edge function response:', data);
    
    return data as PaymentResponse;
  } catch (error) {
    console.error('Error getting payment status:', error);
    return {
      success: false,
      message: 'Failed to get payment status: ' + (error instanceof Error ? error.message : 'Unknown error'),
      paymentId
    };
  }
};
