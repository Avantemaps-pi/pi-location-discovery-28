
import { useState } from 'react';
import { useAuth } from '@/context/auth';
import { executeSubscriptionPayment, getSubscriptionPrice } from '@/utils/piPayment';
import { SubscriptionTier } from '@/utils/piNetwork';
import { toast } from 'sonner';

export const useSubscriptionPayment = () => {
  const { user, isAuthenticated, login, refreshUserData } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("monthly");
  
  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
  };
  
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
      // First refresh user data to ensure we have the latest permissions
      await refreshUserData();
      
      // Get the subscription price
      const subscriptionTier = tier as SubscriptionTier;
      const price = getSubscriptionPrice(subscriptionTier, selectedFrequency);
      
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
