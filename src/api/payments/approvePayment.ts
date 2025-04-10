
/**
 * Payment approval endpoint
 * 
 * This endpoint handles the approval of Pi payments
 * It should be called when the onReadyForServerApproval callback is triggered
 */
import { supabase } from '@/integrations/supabase/client';
import { PaymentRequest, PaymentResponse, StoredPayment } from './types';

export const approvePayment = async (req: PaymentRequest): Promise<PaymentResponse> => {
  try {
    console.log('Approving payment:', req.paymentId);
    
    // In a production environment, this would make an API call to Pi Network
    // using the Platform API to approve the payment
    // Example: await axios.post(`https://api.minepi.com/v2/payments/${req.paymentId}/approve`, {}, { headers: { 'Authorization': `Key ${DEVELOPER_API_KEY}` } });
    
    // For this implementation, we'll simulate the approval
    // and store the payment information in Supabase
    
    const paymentData: StoredPayment = {
      id: req.paymentId,
      userId: req.userId,
      amount: req.amount,
      memo: req.memo,
      metadata: req.metadata,
      status: {
        verified: false,
        completed: false,
        cancelled: false
      },
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    
    // Store the payment in Supabase
    const { error } = await supabase
      .from('payments')
      .insert(paymentData);
    
    if (error) {
      console.error('Error storing payment:', error);
      return {
        success: false,
        message: 'Failed to approve payment: Database error',
        paymentId: req.paymentId
      };
    }
    
    return {
      success: true,
      message: 'Payment approved successfully',
      paymentId: req.paymentId
    };
  } catch (error) {
    console.error('Error approving payment:', error);
    return {
      success: false,
      message: 'Failed to approve payment: ' + (error instanceof Error ? error.message : 'Unknown error'),
      paymentId: req.paymentId
    };
  }
};
