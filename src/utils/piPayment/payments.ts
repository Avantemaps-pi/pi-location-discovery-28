
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable, requestUserPermissions, isSdkInitialized } from '../piNetwork';
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
      toast.error("Pi Network SDK is not available. Please refresh the page and try again.");
      throw new Error("Pi Network SDK is not available");
    }
    
    // Ensure SDK is initialized with proper error handling
    try {
      console.log("Initializing Pi Network SDK before payment...");
      await initializePiNetwork();
      // Check if SDK is initialized
      if (!isSdkInitialized()) {
        // Wait up to 3 seconds for SDK to initialize
        let attempts = 0;
        const maxAttempts = 30; // 3 seconds total (100ms intervals)
        
        while (!isSdkInitialized() && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!isSdkInitialized()) {
          toast.error("Failed to initialize Pi Network. Please refresh and try again.");
          throw new Error("Failed to initialize Pi Network SDK after waiting");
        }
      }
    } catch (error) {
      console.error("Error initializing Pi SDK:", error);
      toast.error("Failed to initialize Pi Network. Please refresh and try again.");
      throw new Error("Failed to initialize Pi Network SDK");
    }
    
    // First, explicitly request payment permissions with proper error handling
    try {
      console.log("Requesting payment permissions before transaction");
      toast.info("Requesting payment permissions...");
      const permissions = await requestUserPermissions();
      if (!permissions) {
        toast.error("Failed to get required payment permissions. Please try logging in again.");
        throw new Error("Failed to get required payment permissions. Please try logging in again.");
      }
      console.log("Successfully obtained payment permissions");
    } catch (error) {
      console.error("Error requesting payment permissions:", error);
      throw new Error("Payment permission not granted. Please log out and log in again to grant payment permissions.");
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
    
    // Check if window.Pi exists and createPayment is a function
    if (!window.Pi || typeof window.Pi.createPayment !== 'function') {
      console.error('Pi.createPayment is not a function or Pi SDK is not properly loaded');
      toast.error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
      throw new Error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
    }
    
    // Check if we have the payments scope before proceeding
    try {
      // Define the callbacks for payment events
      const onReadyForServerApproval = (paymentId: string) => {
        console.log("Payment ready for server approval:", paymentId);
        toast.info("Payment ready for server approval");
        // This is where you would make a server call to approve the payment
        // For testing, we'll just log it
      };

      const onReadyForServerCompletion = (paymentId: string, txid: string) => {
        console.log("Payment ready for server completion:", paymentId, txid);
        toast.info("Payment ready for completion");
        // This is where you would make a server call to complete the payment
        // For testing, we'll just log it
      };

      const onCancel = (paymentId: string) => {
        console.log("Payment cancelled:", paymentId);
        toast.info("Payment was cancelled");
        // Handle payment cancellation
      };

      const onError = (error: Error, payment?: any) => {
        console.error("Payment error:", error, payment);
        toast.error(`Payment error: ${error.message}`);
        // Handle payment error
      };
      
      // Execute the payment with all required callbacks
      toast.info("Creating payment...");
      const payment = await window.Pi.createPayment({
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
        toast.error("Failed to create payment");
        throw new Error("Failed to create payment");
      }
      
      console.log("Payment created:", payment);
      
      // Check if submitPayment is a function
      if (typeof window.Pi.submitPayment !== 'function') {
        console.error('Pi.submitPayment is not a function');
        toast.error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
        throw new Error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
      }
      
      toast.info("Processing payment...");
      const result = await window.Pi.submitPayment(payment.identifier);
      
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
      if (error instanceof Error && error.message && error.message.includes("scope")) {
        console.error("Payment scope error:", error);
        toast.error("Payment permission not granted. Please log out and log in again to grant payment permissions.");
        throw new Error("Payment permission not granted. Please log out and log in again to grant payment permissions.");
      }
      
      // Handle callback errors
      if (error instanceof Error && error.message && error.message.includes("callback")) {
        console.error("Callback function error:", error);
        toast.error("Payment setup failed due to missing callback functions. Please try again.");
        throw new Error("Payment setup failed due to missing callback functions. Please try again.");
      }
      
      if (error instanceof Error) {
        toast.error(`Payment error: ${error.message}`);
      } else {
        toast.error("Unknown payment error occurred");
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
