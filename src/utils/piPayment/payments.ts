
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable } from '../piNetwork';
import { PaymentResult, SubscriptionFrequency } from './types';
import { SubscriptionTier, PaymentDTO, PaymentData, PaymentCallbacks } from '../piNetwork/types';
import { approvePayment, completePayment } from '@/api/payments';

/**
 * Executes a payment transaction for subscription upgrades
 * This implementation follows the Pi Network SDK reference
 */
export const executeSubscriptionPayment = async (
  amount: number,
  tier: SubscriptionTier,
  frequency: SubscriptionFrequency
): Promise<PaymentResult> => {
  try {
    // Ensure Pi SDK is available
    if (!isPiNetworkAvailable()) {
      throw new Error("Pi Network SDK is not available");
    }
    
    // Ensure SDK is initialized
    await initializePiNetwork();
    
    // Create a promise that will be resolved when the payment is processed
    return new Promise((resolve, reject) => {
      try {
        // Create the payment data
        const paymentData: PaymentData = {
          amount: amount,
          memo: `Avante Maps ${tier} subscription (${frequency})`,
          metadata: {
            subscriptionTier: tier,
            frequency: frequency,
            timestamp: new Date().toISOString(),
          }
        };
        
        console.log("Creating payment with data:", paymentData);
        
        // Define the callbacks for payment events according to SDK reference
        const callbacks: PaymentCallbacks = {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId);
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              console.error("User not authenticated");
              return;
            }
            
            // Call our server-side approval endpoint
            const approvalResult = await approvePayment({
              paymentId,
              userId: piUser.uid,
              amount: paymentData.amount,
              memo: paymentData.memo,
              metadata: paymentData.metadata
            });
            
            if (!approvalResult.success) {
              console.error("Payment approval failed:", approvalResult.message);
              toast.error("Payment approval failed. Please try again.");
            } else {
              console.log("Payment approved:", paymentId);
            }
          },
          
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion:", paymentId, txid);
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              console.error("User not authenticated");
              return;
            }
            
            // Call our server-side completion endpoint
            const completionResult = await completePayment({
              paymentId,
              txid,
              userId: piUser.uid,
              amount: paymentData.amount,
              memo: paymentData.memo,
              metadata: paymentData.metadata
            });
            
            if (!completionResult.success) {
              console.error("Payment completion failed:", completionResult.message);
              reject(new Error(completionResult.message));
            } else {
              console.log("Payment completed:", paymentId, txid);
              resolve({
                success: true,
                transactionId: txid,
                message: "Payment successful! Your subscription has been upgraded."
              });
            }
          },
          
          onCancel: (paymentId: string) => {
            console.log("Payment cancelled:", paymentId);
            // Handle payment cancellation
            resolve({
              success: false,
              message: "Payment was cancelled."
            });
          },
          
          onError: (error: Error, payment?: PaymentDTO) => {
            console.error("Payment error:", error, payment);
            // Handle payment error
            reject(error);
          }
        };
        
        // Execute the payment with all required callbacks
        window.Pi?.createPayment(paymentData, callbacks);
      } catch (error) {
        console.error("Error creating payment:", error);
        reject(error);
      }
    });
  } catch (error) {
    console.error("Pi payment error:", error);
    let errorMessage = "Payment failed";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      success: false,
      message: errorMessage
    };
  }
};
