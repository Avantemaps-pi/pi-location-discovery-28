
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable } from './piNetworkUtils';
import { SubscriptionTier } from './piNetworkUtils';

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export const executeSubscriptionPayment = async (
  amount: number,
  tier: SubscriptionTier,
  frequency: 'monthly' | 'yearly'
): Promise<PaymentResult> => {
  try {
    // Ensure Pi SDK is available
    if (!isPiNetworkAvailable()) {
      throw new Error("Pi Network SDK is not available");
    }
    
    // Ensure SDK is initialized
    await initializePiNetwork();
    
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
      // Execute the payment - make sure the user has been authenticated with the payments scope
      const payment = await window.Pi?.createPayment({
        amount: amount,
        memo: `Avante Maps ${tier} subscription (${frequency})`,
        metadata: metadata,
      });
      
      if (!payment) {
        throw new Error("Failed to create payment");
      }
      
      console.log("Payment created:", payment);
      
      // Wait for the payment to complete
      const result = await window.Pi?.submitPayment(payment.identifier);
      
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

// Helper to determine the correct price based on tier and frequency
export const getSubscriptionPrice = (
  tier: SubscriptionTier,
  frequency: string
): number => {
  const prices = {
    [SubscriptionTier.INDIVIDUAL]: { monthly: 0, yearly: 0 },
    [SubscriptionTier.SMALL_BUSINESS]: { monthly: 5, yearly: 48 },
    [SubscriptionTier.ORGANIZATION]: { monthly: 10, yearly: 96 },
  };
  
  // Default to monthly price if frequency is invalid
  const validFrequency = frequency === 'yearly' ? 'yearly' : 'monthly';
  
  // Convert yearly price to correct amount (monthly price × 12 × 0.8 for 20% discount)
  if (validFrequency === 'yearly' && typeof prices[tier].monthly === 'number') {
    return prices[tier].monthly * 12 * 0.8;
  }
  
  return prices[tier][validFrequency] || 0;
};
