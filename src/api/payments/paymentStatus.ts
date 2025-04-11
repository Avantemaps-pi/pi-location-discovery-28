
/**
 * Payment status endpoint
 * 
 * This endpoint retrieves the current status of a payment
 */
import { PaymentResponse, paymentStore } from './types';

export const getPaymentStatus = async (paymentId: string): Promise<PaymentResponse> => {
  try {
    console.log('Getting payment status:', paymentId);
    
    // Fetch payment from memory storage
    const payment = paymentStore[paymentId];
    
    if (!payment) {
      console.error('Payment not found:', paymentId);
      return {
        success: false,
        message: 'Payment not found',
        paymentId
      };
    }
    
    return {
      success: true,
      message: 'Payment status retrieved successfully',
      paymentId,
      txid: payment.txid,
      status: {
        paymentId,
        txid: payment.txid,
        verified: payment.status.verified,
        completed: payment.status.completed,
        cancelled: payment.status.cancelled,
        error: payment.status.error
      }
    };
  } catch (error) {
    console.error('Error getting payment status:', error);
    return {
      success: false,
      message: 'Failed to get payment status: ' + (error instanceof Error ? error.message : 'Unknown error'),
      paymentId
    };
  }
};
