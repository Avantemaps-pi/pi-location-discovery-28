
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable } from '../piNetwork';
import { PaymentResult, SubscriptionFrequency } from './types';
import { SubscriptionTier, PaymentDTO, PaymentData, PaymentCallbacks } from '../piNetwork/types';
import { useAuth } from '@/context/auth';

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
          onReadyForServerApproval: async (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId);
            
            try {
              // Get the current access token - in a production app, you'd use a more secure approach
              // @ts-ignore - Accessing auth context directly is not ideal but works for this demo
              const accessToken = window.piAuthToken || localStorage.getItem('pi_access_token');
              
              if (!accessToken) {
                console.error('No access token available for payment approval');
                toast.error("Authentication error. Please login again.");
                reject(new Error("No access token available"));
                return;
              }
              
              // Call our backend API to approve the payment
              const response = await fetch('/api/payments/approve', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ paymentId })
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                console.error('Server approval failed:', errorData);
                toast.error("Payment approval failed. Please try again.");
                // We don't reject here as the Pi SDK will retry
              } else {
                console.log('Server approved payment');
                toast.info("Payment approved! Waiting for you to confirm the transaction.");
              }
            } catch (error) {
              console.error('Error during server approval:', error);
              toast.error("Error during payment approval.");
              // We don't reject here as the Pi SDK will retry
            }
          },
          
          // Phase III - Server-Side Completion
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion. Payment ID:", paymentId, "Transaction ID:", txid);
            
            try {
              // Get the current access token - in a production app, you'd use a more secure approach
              // @ts-ignore - Accessing auth context directly is not ideal but works for this demo
              const accessToken = window.piAuthToken || localStorage.getItem('pi_access_token');
              
              if (!accessToken) {
                console.error('No access token available for payment completion');
                toast.error("Authentication error. Please login again.");
                reject(new Error("No access token available"));
                return;
              }
              
              // Call our backend API to complete the payment
              const response = await fetch('/api/payments/complete', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({ paymentId, txid })
              });
              
              if (!response.ok) {
                const errorData = await response.json();
                console.error('Server completion failed:', errorData);
                toast.error("Payment completion failed. Please contact support.");
                reject(new Error("Payment completion failed"));
              } else {
                const result = await response.json();
                console.log('Server completed payment:', result);
                toast.success("Payment successful! Your subscription has been upgraded.");
                
                // Resolve the promise with success status after server confirmation
                resolve({
                  success: true,
                  transactionId: txid,
                  message: "Payment successful! Your subscription has been upgraded."
                });
              }
            } catch (error) {
              console.error('Error during server completion:', error);
              toast.error("Error during payment completion.");
              reject(error);
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
