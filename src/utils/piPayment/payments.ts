
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable, determineSandboxMode } from '../piNetwork';
import { PaymentResult, SubscriptionFrequency } from './types';
import { SubscriptionTier, PaymentDTO, PaymentData, PaymentCallbacks } from '../piNetwork/types';
import { approvePayment, completePayment } from '@/api/payments';

// Global flag to track payment state
let paymentInProgress = false;

// Timeout settings for payment operations (reduced)
const PAYMENT_TIMEOUT = 60000; // 1 minute (reduced from 2 minutes)
const POLLING_INTERVAL = 2000; // Poll every 2 seconds

/**
 * Executes a payment transaction for subscription upgrades
 * This implementation follows the Pi Network SDK reference and payments.md documentation
 */
export const executeSubscriptionPayment = async (
  amount: number,
  tier: SubscriptionTier,
  frequency: SubscriptionFrequency
): Promise<PaymentResult> => {
  try {
    // Phase I - Payment creation - First step: prevent multiple simultaneous payments
    if (paymentInProgress) {
      console.warn("Payment already in progress");
      return {
        success: false,
        message: "A payment is already being processed. Please wait."
      };
    }
    
    paymentInProgress = true;
    
    // Ensure Pi SDK is available before attempting to create a payment
    if (!isPiNetworkAvailable()) {
      throw new Error("Pi Network SDK is not available");
    }
    
    // Ensure SDK is initialized
    await initializePiNetwork();
    
    // Create a promise that will be resolved when the payment is processed
    return new Promise((resolve, reject) => {
      try {
        // Create the payment data according to SDK requirements
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
        
        // Set up a timeout to handle payment approval timeouts
        let approvalTimeoutId: number | undefined;
        let completionTimeoutId: number | undefined;
        
        // Phase I - Payment creation - Second step: Define callbacks for payment flow
        const callbacks: PaymentCallbacks = {
          // Phase I - Payment creation and Server-Side Approval
          onReadyForServerApproval: async (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId);
            
            // Clear any existing timeout
            if (approvalTimeoutId) {
              clearTimeout(approvalTimeoutId);
            }
            
            // Setup timeout for approval - reduced to 45 seconds from 60
            approvalTimeoutId = window.setTimeout(() => {
              console.error("Payment approval timed out");
              toast.error("Payment approval timed out. Please try again.");
              paymentInProgress = false;
              reject(new Error("Payment approval timed out"));
            }, 45000); // 45 second timeout (reduced from 60s)
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              console.error("User not authenticated");
              clearTimeout(approvalTimeoutId);
              paymentInProgress = false;
              reject(new Error("User not authenticated"));
              return;
            }
            
            // Server-Side Approval: Call our server-side approval endpoint with retries
            let retries = 3;
            let success = false;
            
            while (retries > 0 && !success) {
              try {
                // Show user feedback
                if (retries < 3) {
                  toast.info("Processing payment...");
                }
                
                const approvalResult = await approvePayment({
                  paymentId,
                  userId: piUser.uid,
                  amount: paymentData.amount,
                  memo: paymentData.memo,
                  metadata: paymentData.metadata
                });
                
                if (approvalResult.success) {
                  success = true;
                  console.log("Payment approved successfully:", paymentId);
                } else {
                  console.warn(`Payment approval attempt failed (${retries} retries left):`, 
                    approvalResult.message);
                  retries--;
                  // Wait before retrying
                  await new Promise(r => setTimeout(r, 1000));
                }
              } catch (error) {
                console.error("Error in payment approval:", error);
                retries--;
                // Wait before retrying
                await new Promise(r => setTimeout(r, 1000));
              }
            }
            
            if (!success) {
              clearTimeout(approvalTimeoutId);
              toast.error("Failed to approve payment after multiple attempts");
              paymentInProgress = false;
              reject(new Error("Failed to approve payment after multiple attempts"));
            }
          },
          
          // Phase III - Server-Side Completion
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion:", paymentId, txid);
            
            // Clear the approval timeout if it exists
            if (approvalTimeoutId) {
              clearTimeout(approvalTimeoutId);
            }
            
            // Setup timeout for completion - reduced to 45 seconds
            completionTimeoutId = window.setTimeout(() => {
              console.error("Payment completion timed out");
              toast.error("Payment completion timed out. Please contact support.");
              paymentInProgress = false;
              reject(new Error("Payment completion timed out"));
            }, 45000); // 45 second timeout (reduced from 60s)
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              console.error("User not authenticated");
              clearTimeout(completionTimeoutId);
              paymentInProgress = false;
              reject(new Error("User not authenticated"));
              return;
            }
            
            // Server-Side Completion: Call our server-side completion endpoint with retries
            let retries = 3;
            let success = false;
            
            while (retries > 0 && !success) {
              try {
                // Show user feedback
                if (retries < 3) {
                  toast.info("Finalizing payment...");
                }
                
                const completionResult = await completePayment({
                  paymentId,
                  txid,
                  userId: piUser.uid,
                  amount: paymentData.amount,
                  memo: paymentData.memo,
                  metadata: paymentData.metadata
                });
                
                if (completionResult.success) {
                  success = true;
                  console.log("Payment completed successfully:", paymentId, txid);
                  
                  // Clear timeout
                  if (completionTimeoutId) {
                    clearTimeout(completionTimeoutId);
                  }
                  
                  paymentInProgress = false;
                  resolve({
                    success: true,
                    transactionId: txid,
                    message: "Payment successful! Your subscription has been upgraded."
                  });
                } else {
                  console.warn(`Payment completion attempt failed (${retries} retries left):`, 
                    completionResult.message);
                  retries--;
                  // Wait before retrying
                  await new Promise(r => setTimeout(r, 1000));
                }
              } catch (error) {
                console.error("Error in payment completion:", error);
                retries--;
                // Wait before retrying
                await new Promise(r => setTimeout(r, 1000));
              }
            }
            
            if (!success) {
              clearTimeout(completionTimeoutId);
              paymentInProgress = false;
              reject(new Error("Failed to complete payment after multiple attempts"));
            }
          },
          
          // Error handling for user cancellation
          onCancel: (paymentId: string) => {
            console.log("Payment cancelled:", paymentId);
            // Clean up timeouts
            if (approvalTimeoutId) clearTimeout(approvalTimeoutId);
            if (completionTimeoutId) clearTimeout(completionTimeoutId);
            
            // Handle payment cancellation
            paymentInProgress = false;
            resolve({
              success: false,
              message: "Payment was cancelled."
            });
          },
          
          // Error handling for payment errors
          onError: (error: Error, payment?: PaymentDTO) => {
            console.error("Payment error:", error, payment);
            // Clean up timeouts
            if (approvalTimeoutId) clearTimeout(approvalTimeoutId);
            if (completionTimeoutId) clearTimeout(completionTimeoutId);
            
            // Handle payment error
            paymentInProgress = false;
            reject(error);
          }
        };
        
        // Phase I - Initiate payment flow with the Pi SDK
        window.Pi?.createPayment(paymentData, callbacks);
      } catch (error) {
        console.error("Error creating payment:", error);
        paymentInProgress = false;
        reject(error);
      }
    });
  } catch (error) {
    console.error("Pi payment error:", error);
    paymentInProgress = false;
    
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

// Check for incomplete payments on initialization
export const checkForIncompletePayments = (): PaymentDTO | null => {
  try {
    const storedPayment = localStorage.getItem('pi_incomplete_payment');
    
    if (storedPayment) {
      const payment: PaymentDTO = JSON.parse(storedPayment);
      console.log('Found incomplete payment:', payment);
      return payment;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking for incomplete payments:', error);
    return null;
  }
};

// Clear incomplete payment data
export const clearIncompletePayment = (): void => {
  try {
    localStorage.removeItem('pi_incomplete_payment');
  } catch (error) {
    console.error('Error clearing incomplete payment:', error);
  }
};
