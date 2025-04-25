
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable, requestUserPermissions } from '../piNetwork';
import { PaymentResult, SubscriptionFrequency } from './types';
import { SubscriptionTier, PaymentDTO, PaymentData, PaymentCallbacks } from '../piNetwork/types';
import { approvePayment, completePayment } from '@/api/payments';

export const executeSubscriptionPayment = async (
  amount: number,
  tier: SubscriptionTier,
  frequency: SubscriptionFrequency
): Promise<PaymentResult> => {
  try {
    // Ensure Pi SDK is available
    if (!isPiNetworkAvailable()) {
      const errorMsg = "Pi Network SDK is not available";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    // Ensure SDK is initialized
    await initializePiNetwork();
    
    // Request necessary permissions first
    console.log("Requesting user permissions before payment...");
    const userInfo = await requestUserPermissions();
    
    // Validate wallet permission was granted
    if (!userInfo) {
      const errorMsg = "Failed to authenticate with Pi Network";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    if (!userInfo.walletAddress) {
      const errorMsg = "Wallet address permission is required for payments";
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
    
    console.log("Permissions granted, proceeding with payment...");
    
    // Create a promise that will be resolved when the payment is processed
    return new Promise((resolve, reject) => {
      try {
        // Create the payment data according to SDK reference
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
        toast.info(`Initiating payment of ${amount} Pi`);
        
        // Define the callbacks according to SDK reference
        const callbacks: PaymentCallbacks = {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId);
            toast.info("Processing payment...");
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              const errorMsg = "User not authenticated";
              console.error(errorMsg);
              toast.error("Authentication error. Please login again.");
              reject(new Error(errorMsg));
              return;
            }
            
            try {
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
                reject(new Error(approvalResult.message));
              } else {
                console.log("Payment approved:", paymentId);
                toast.success("Payment approved! Completing transaction...");
              }
            } catch (error) {
              console.error("Error during payment approval:", error);
              reject(error);
            }
          },
          
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion:", paymentId, txid);
            toast.info("Finalizing transaction...");
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              const errorMsg = "User not authenticated";
              console.error(errorMsg);
              reject(new Error(errorMsg));
              return;
            }
            
            try {
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
            } catch (error) {
              console.error("Error during payment completion:", error);
              reject(error);
            }
          },
          
          onCancel: (paymentId: string) => {
            console.log("Payment cancelled:", paymentId);
            toast.warning("Payment was cancelled by user");
            resolve({
              success: false,
              message: "Payment was cancelled."
            });
          },
          
          onError: (error: Error, payment?: PaymentDTO) => {
            console.error("Payment error:", error, payment);
            toast.error(`Payment error: ${error.message}`);
            reject(error);
          }
        };
        
        console.log("About to call Pi.createPayment...");
        
        // Execute the payment with all required callbacks
        if (!window.Pi) {
          throw new Error("Pi SDK not available");
        }
        
        // Directly create the payment after ensuring SDK is available
        window.Pi.createPayment(paymentData, callbacks);
        console.log("Pi.createPayment called successfully");
        
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
