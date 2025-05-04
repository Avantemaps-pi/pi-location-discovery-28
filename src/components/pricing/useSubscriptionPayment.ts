
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
  
  // Update user subscription without payment
  const updateUserSubscription = async (tier: string) => {
    if (!isAuthenticated) {
      toast.info("Please log in to change your subscription");
      await login();
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      // Simulate API call to update subscription
      // In a real app, you would make an API call to update the subscription in the backend
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      toast.success(`Successfully updated to ${tier.charAt(0).toUpperCase() + tier.slice(1)} subscription`);
      
      // Refresh user data to update subscription info in the UI
      await refreshUserData();
      
      console.log('User subscription updated to:', tier);
      
      // Return the updated tier for any component that needs it
      return tier;
    } catch (error) {
      console.error("Subscription update error:", error);
      toast.error("Failed to update subscription");
      return null;
    } finally {
      setIsProcessingPayment(false);
    }
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
      // First refresh user data to ensure we have the latest permissions including wallet_address
      console.log("Refreshing user data before payment...");
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
        } else if (result.message.includes("Failed to get user permissions")) {
          toast.error("Permission issue detected. Please log in again to grant all required permissions.");
          await login();
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      
      // If it's a permissions error, prompt to login again
      if (error instanceof Error) {
        if (error.message.includes("permission not granted") || 
            error.message.includes("Failed to get user permissions") ||
            error.message.includes("wallet_address")) {
          toast.error(error.message);
          toast.info("Please try logging in again to grant all required permissions");
          await login(); // Re-login to get fresh permissions
        } else {
          toast.error("Failed to process subscription payment: " + error.message);
        }
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
    updateUserSubscription,
    userSubscriptionTier: user?.subscriptionTier
  };
};
