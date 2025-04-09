
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable } from '../piNetwork';
import { PaymentResult, SubscriptionFrequency } from './types';
import { SubscriptionTier, PaymentDTO, PaymentData, PaymentCallbacks } from '../piNetwork/types';

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
          onReadyForServerApproval: (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId);
            // This is where you would make a server call to approve the payment
            // For testing, we're just logging it
            
            // In production, you would make an API call to your backend:
            // fetch('/api/payments/approve', {
            //   method: 'POST',
            //   body: JSON.stringify({ paymentId }),
            //   headers: { 'Content-Type': 'application/json' }
            // });
          },
          
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion:", paymentId, txid);
            // This is where you would make a server call to complete the payment
            // For testing, we'll just log it and resolve the promise
            
            // In production, you would make an API call to your backend:
            // fetch('/api/payments/complete', {
            //   method: 'POST',
            //   body: JSON.stringify({ paymentId, txid }),
            //   headers: { 'Content-Type': 'application/json' }
            // });
            
            // For this demo, we'll consider the payment successful when we reach this point
            resolve({
              success: true,
              transactionId: txid,
              message: "Payment successful! Your subscription has been upgraded."
            });
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
