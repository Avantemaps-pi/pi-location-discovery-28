
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable, requestUserPermissions, requestWalletPermission } from '../piNetwork';
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
      toast.error("Pi Network SDK is not available");
      throw new Error("Pi Network SDK is not available");
    }
    
    // Ensure SDK is initialized
    await initializePiNetwork();
    
    // Step 1: First verify permissions with a comprehensive check
    console.log("Verifying all permissions before payment...");
    const userInfo = await requestUserPermissions();
    
    if (!userInfo) {
      console.error("Failed to get user permissions");
      return {
        success: false,
        message: "Failed to get user permissions. Please try again."
      };
    }
    
    // Step 2: If wallet address is missing, explicitly request it
    if (!userInfo.walletAddress) {
      console.log("Wallet address missing. Making explicit request for wallet_address permission");
      toast.info("Requesting wallet address permission needed for payments");
      
      // Make a focused request just for wallet permission
      const walletAddress = await requestWalletPermission();
      
      if (!walletAddress) {
        console.error("Wallet address permission denied");
        // Provide clear error message for the user
        return {
          success: false,
          message: "Wallet address permission is required for processing payments. Please grant this permission when prompted."
        };
      }
      
      // At this point we have the wallet address, can proceed with payment
      console.log("Successfully obtained wallet address permission");
    }
    
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
        toast.info(`Initiating payment of ${amount} Pi`);
        
        // Define the callbacks for payment events according to SDK reference
        const callbacks: PaymentCallbacks = {
          onReadyForServerApproval: async (paymentId: string) => {
            console.log("Payment ready for server approval:", paymentId);
            toast.info("Processing payment...");
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              console.error("User not authenticated");
              toast.error("Authentication error. Please login again.");
              reject(new Error("User not authenticated"));
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
              reject(new Error(approvalResult.message));
            } else {
              console.log("Payment approved:", paymentId);
              toast.success("Payment approved! Completing transaction...");
            }
          },
          
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            console.log("Payment ready for server completion:", paymentId, txid);
            toast.info("Finalizing transaction...");
            
            // Get the current authenticated user information
            const piUser = window.Pi?.currentUser;
            if (!piUser?.uid) {
              console.error("User not authenticated");
              reject(new Error("User not authenticated"));
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
            toast.warning("Payment was cancelled by user");
            resolve({
              success: false,
              message: "Payment was cancelled."
            });
          },
          
          onError: (error: Error, payment?: PaymentDTO) => {
            console.error("Payment error:", error, payment);
            let errorMessage = error.message;
            
            // Provide more helpful error messages based on common issues
            if (errorMessage.includes('wallet_address') || errorMessage.includes('permission')) {
              errorMessage = "Wallet address permission is required. Please grant this permission when prompted.";
            }
            
            toast.error(`Payment error: ${errorMessage}`);
            // Handle payment error
            reject(error);
          }
        };
        
        console.log("About to call Pi.createPayment...");
        
        // Execute the payment with all required callbacks
        try {
          if (!window.Pi) {
            throw new Error("Pi SDK not available");
          }
          window.Pi.createPayment(paymentData, callbacks);
          console.log("Pi.createPayment called successfully");
        } catch (error) {
          console.error("Error calling createPayment:", error);
          reject(error);
        }
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
