
import { useState, useCallback } from 'react';
import { useAuth } from '@/context/auth';
import { executeSubscriptionPayment, getSubscriptionPrice } from '@/utils/piPayment';
import { SubscriptionTier } from '@/utils/piNetwork';
import { toast } from 'sonner';
import { 
  isPiNetworkAvailable, 
  initializePiNetwork, 
  isSdkInitialized,
  waitForSdkInitialization 
} from '@/utils/piNetwork';

export const useSubscriptionPayment = () => {
  const { user, isAuthenticated, login, refreshUserData } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("monthly");
  
  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
  };
  
  // Helper function to ensure SDK is ready
  const ensureSDKReady = useCallback(async (): Promise<boolean> => {
    console.log("Checking if Pi Network SDK is ready...");
    
    // First check if Pi SDK is available
    if (!isPiNetworkAvailable()) {
      console.log("Pi Network SDK is not available, attempting to load it...");
      toast.info("Loading Pi Network SDK, please wait...");
      
      try {
        const initResult = await initializePiNetwork();
        if (!initResult) {
          console.error("Failed to initialize Pi Network");
          toast.error("Failed to initialize Pi Network. Please refresh and try again.");
          return false;
        }
      } catch (error) {
        console.error("SDK initialization error:", error);
        toast.error("Failed to initialize Pi Network. Please refresh and try again.");
        return false;
      }
    }
    
    // Wait for SDK to be fully initialized
    if (!isSdkInitialized()) {
      console.log("Waiting for SDK to initialize...");
      toast.info("Preparing Pi Network, please wait...");
      
      try {
        await waitForSdkInitialization(8000); // Wait up to 8 seconds
        console.log("SDK initialization complete");
      } catch (timeoutError) {
        console.error("Timed out waiting for SDK initialization");
        toast.error("Failed to initialize Pi Network. Please refresh and try again.");
        return false;
      }
    }
    
    console.log("Pi Network SDK is ready");
    return true;
  }, []);
  
  const handleSubscribe = async (tier: string) => {
    // Skip if it's the free tier or if it's marked as coming soon
    if (tier === "individual" || tier.includes("coming-soon")) {
      return;
    }
    
    // If not authenticated, prompt to login first
    if (!isAuthenticated) {
      toast.info("Please log in to upgrade your subscription");
      await login();
      return;
    }
    
    // Don't allow upgrading to the same tier
    if (user?.subscriptionTier === tier) {
      toast.info("You are already subscribed to this plan");
      return;
    }
    
    setIsProcessingPayment(true);
    
    try {
      // Ensure SDK is properly initialized
      const sdkReady = await ensureSDKReady();
      if (!sdkReady) {
        setIsProcessingPayment(false);
        return;
      }
      
      // First refresh user data to ensure we have the latest permissions
      console.log("Refreshing user data before payment...");
      await refreshUserData();
      
      // Get the subscription price
      const subscriptionTier = tier as SubscriptionTier;
      const price = getSubscriptionPrice(subscriptionTier, selectedFrequency);
      
      toast.info("Preparing payment, please wait...");
      
      // Execute the payment
      const result = await executeSubscriptionPayment(
        price,
        subscriptionTier,
        selectedFrequency as 'monthly' | 'yearly'
      );
      
      if (result.success) {
        toast.success(result.message);
        // Refresh user data to update subscription info
        await refreshUserData();
      } else {
        // Handle permission errors with a prompt to login again
        if (result.message.includes("permission not granted")) {
          toast.error(result.message);
          toast.info("Attempting to refresh your permissions...");
          await login(); // Re-login to get fresh permissions
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      
      // If it's a permissions error, prompt to login again
      if (error instanceof Error && error.message.includes("permission not granted")) {
        toast.error(error.message);
        toast.info("Please try logging in again to grant payment permissions");
        await login(); // Re-login to get fresh permissions
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to process subscription payment");
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };
  
  return {
    isProcessingPayment,
    selectedFrequency,
    handleFrequencyChange,
    handleSubscribe,
    userSubscriptionTier: user?.subscriptionTier
  };
};
