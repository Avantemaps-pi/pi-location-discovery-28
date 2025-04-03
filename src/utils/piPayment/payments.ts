
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable, requestUserPermissions } from '../piNetwork';
import { PaymentResult, SubscriptionFrequency } from './types';
import { SubscriptionTier } from '../piNetwork';

/**
 * Executes a payment transaction for subscription upgrades
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
    
    // First, explicitly request payment permissions
    const permissions = await requestUserPermissions();
    if (!permissions) {
      throw new Error("Failed to get user permissions");
    }
    
    // Create a payment identifier
    const paymentId = `subscription_${tier}_${frequency}_${Date.now()}`;
    
    // Prepare metadata for the payment
    const metadata = {
      subscriptionTier: tier,
      frequency: frequency,
      timestamp: new Date().toISOString(),
    };
    
    console.log("Creating payment with amount:", amount);
    
    // Check if we have the payments scope before proceeding
    try {
      // Define the callbacks for payment events
      const onReadyForServerApproval = (paymentId: string) => {
        console.log("Payment ready for server approval:", paymentId);
        // This is where you would make a server call to approve the payment
        // For testing, we'll just log it
      };

      const onReadyForServerCompletion = (paymentId: string, txid: string) => {
        console.log("Payment ready for server completion:", paymentId, txid);
        // This is where you would make a server call to complete the payment
        // For testing, we'll just log it
      };

      const onCancel = (paymentId: string) => {
        console.log("Payment cancelled:", paymentId);
        // Handle payment cancellation
      };

      const onError = (error: Error, payment?: any) => {
        console.error("Payment error:", error, payment);
        // Handle payment error
      };
      
      // Execute the payment with all required callbacks
      const payment = await window.Pi?.createPayment({
        amount: amount,
        memo: `Avante Maps ${tier} subscription (${frequency})`,
        metadata: metadata,
      }, {
        onReadyForServerApproval,
        onReadyForServerCompletion,
        onCancel,
        onError
      });
      
      if (!payment) {
        throw new Error("Failed to create payment");
      }
      
      console.log("Payment created:", payment);
      
      const result = await window.Pi!.submitPayment(payment.identifier);
      
      console.log("Payment result:", result);
      
      if (result?.status === 'completed') {
        return {
          success: true,
          transactionId: result.transaction?.txid,
          message: "Payment successful! Your subscription has been upgraded."
        };
      } else {
        return {
          success: false,
          message: `Payment failed: ${result?.status || 'unknown error'}`
        };
      }
    } catch (error) {
      // Specific handling for permissions errors
      if (error.message && error.message.includes("scope")) {
        console.error("Payment scope error:", error);
        throw new Error("Payment permission not granted. Please log out and log in again to grant payment permissions.");
      }
      
      // Handle callback errors
      if (error.message && error.message.includes("callback")) {
        console.error("Callback function error:", error);
        throw new Error("Payment setup failed due to missing callback functions. Please try again.");
      }
      
      throw error;
    }
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
