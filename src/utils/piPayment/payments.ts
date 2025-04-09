
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable } from '../piNetwork';
import { PaymentResult, SubscriptionFrequency } from './types';
import { SubscriptionTier, PaymentDTO, PaymentData, PaymentCallbacks } from '../piNetwork/types';

/**
 * Executes a payment transaction for subscription upgrades
 * This implementation follows the Pi Network payment flow as documented
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
          // Phase I - Payment creation and Server-Side Approval
          onReadyForServerApproval: (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId);
            
            // In a production app, you would send the paymentId to your backend:
            // Example implementation:
            // fetch('/api/payments/approve', {
            //   method: 'POST',
            //   body: JSON.stringify({ paymentId }),
            //   headers: { 'Content-Type': 'application/json' }
            // }).then(response => {
            //   if (!response.ok) {
            //     console.error('Server approval failed');
            //   } else {
            //     console.log('Server approved payment');
            //   }
            // }).catch(error => {
            //   console.error('Error during server approval:', error);
            // });
            
            // For development/demo purposes:
            toast.info("Payment ready for server approval. In production, your server would approve this payment.");
          },
          
          // Phase III - Server-Side Completion
          onReadyForServerCompletion: (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion. Payment ID:", paymentId, "Transaction ID:", txid);
            
            // In a production app, you would send both IDs to your backend:
            // Example implementation:
            // fetch('/api/payments/complete', {
            //   method: 'POST',
            //   body: JSON.stringify({ paymentId, txid }),
            //   headers: { 'Content-Type': 'application/json' }
            // }).then(response => {
            //   if (!response.ok) {
            //     throw new Error('Server completion failed');
            //   }
            //   return response.json();
            // }).then(data => {
            //   // Resolve the promise with success status after server confirmation
            //   resolve({
            //     success: true,
            //     transactionId: txid,
            //     message: "Payment successful! Your subscription has been upgraded."
            //   });
            // }).catch(error => {
            //   console.error('Error during server completion:', error);
            //   reject(error);
            // });
            
            // For development/demo purposes:
            toast.success("Transaction submitted! In production, your server would verify and complete this payment.");
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
        
        // Execute the payment with all required callbacks as per SDK reference
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
