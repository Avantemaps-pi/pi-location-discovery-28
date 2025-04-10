
/**
 * Payment completion endpoint
 * 
 * This endpoint handles the completion of Pi payments
 * It should be called when the onReadyForServerCompletion callback is triggered
 */
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentResponse } from './types';

export const completePayment = async (req: PaymentRequest & { txid: string }): Promise<PaymentResponse> => {
  try {
    console.log('Completing payment:', req.paymentId, 'with txid:', req.txid);
    
    // In a production environment, this would make an API call to Pi Network
    // using the Platform API to complete the payment
    // Example: await axios.post(`https://api.minepi.com/v2/payments/${req.paymentId}/complete`, { txid: req.txid }, { headers: { 'Authorization': `Key ${DEVELOPER_API_KEY}` } });
    
    // For this implementation, we'll simulate the completion
    // and update the payment information in Supabase
    
    // Get the current payment
    const { data: existingPayment, error: fetchError } = await supabase
      .from('payments')
      .select('*')
      .eq('id', req.paymentId)
      .single();
    
    if (fetchError || !existingPayment) {
      console.error('Error fetching payment:', fetchError);
      return {
        success: false,
        message: 'Failed to complete payment: Payment not found',
        paymentId: req.paymentId
      };
    }
    
    // Update the payment with transaction ID and mark as completed
    const { error } = await supabase
      .from('payments')
      .update({
        txid: req.txid,
        status: {
          verified: true,
          completed: true,
          cancelled: false
        },
        updatedAt: Date.now()
      })
      .eq('id', req.paymentId);
    
    if (error) {
      console.error('Error updating payment:', error);
      return {
        success: false,
        message: 'Failed to complete payment: Database error',
        paymentId: req.paymentId,
        txid: req.txid
      };
    }
    
    // Process subscription update if this is a subscription payment
    if (req.metadata?.subscriptionTier) {
      await updateUserSubscription(req.userId, req.metadata.subscriptionTier);
    }
    
    return {
      success: true,
      message: 'Payment completed successfully',
      paymentId: req.paymentId,
      txid: req.txid
    };
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

// Helper function to update user subscription
async function updateUserSubscription(userId: string, subscriptionTier: string) {
  try {
    // Update user's subscription tier in Supabase
    const { error } = await supabase
      .from('users')
      .update({
        subscriptionTier,
        subscriptionUpdatedAt: Date.now()
      })
      .eq('uid', userId);
    
    if (error) {
      console.error('Error updating user subscription:', error);
    }
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}
