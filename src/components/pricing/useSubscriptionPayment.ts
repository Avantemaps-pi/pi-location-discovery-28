
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/auth';
import { executeSubscriptionPayment, getSubscriptionPrice } from '@/utils/piPayment';
import { SubscriptionTier } from '@/utils/piNetwork';
import { toast } from 'sonner';

export const useSubscriptionPayment = () => {
  const { user, isAuthenticated, login, refreshUserData } = useAuth();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState("monthly");
  const navigate = useNavigate();
  
  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency);
  };
  
  const updateUserSubscription = async (tier: string) => {
    if (!isAuthenticated) {
      toast.info("Please log in to change your subscription");
      await login();
      return;
    }
    
    try {
      setIsProcessingPayment(true);
      
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      toast.success(`Successfully updated to ${tier.charAt(0).toUpperCase() + tier.slice(1)} subscription`);
      
      await refreshUserData();
      
      console.log('User subscription updated to:', tier);
      
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
    if (tier === "individual" || tier.includes("coming-soon")) {
      console.log("Skipping payment for individual tier or coming soon feature");
      return;
    }
    
    if (!isAuthenticated) {
      toast.info("Please log in to upgrade your subscription");
      await login();
      return;
    }
    
    if (user?.subscriptionTier === tier) {
      toast.info("You are already subscribed to this plan");
      return;
    }
    
    console.log("Starting payment process for tier:", tier);
    setIsProcessingPayment(true);
    
    try {
      console.log("Refreshing user data before payment...");
      await refreshUserData();
      
      // Check if wallet permission is granted
      if (!user?.walletAddress) {
        toast.warning("Wallet address permission is required for payments");
        navigate('?permissionsNeeded=true');
        return;
      }
      
      const subscriptionTier = tier as SubscriptionTier;
      const price = getSubscriptionPrice(subscriptionTier, selectedFrequency);
      
      console.log(`Processing payment of ${price} Pi for ${subscriptionTier} subscription (${selectedFrequency})`);
      
      const result = await executeSubscriptionPayment(
        price,
        subscriptionTier,
        selectedFrequency as 'monthly' | 'yearly'
      );
      
      if (result.success) {
        toast.success(result.message);
        await refreshUserData();
      } else {
        if (result.message.includes("permission") || result.message.includes("wallet_address")) {
          toast.error(result.message);
          navigate('?permissionsNeeded=true');
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      console.error("Subscription error:", error);
      
      if (error instanceof Error) {
        if (error.message.includes("permission") || 
            error.message.includes("wallet address") ||
            error.message.includes("Failed to get user permissions") ||
            error.message.includes("wallet_address")) {
          toast.error("Additional permissions are needed to process this payment");
          navigate('?permissionsNeeded=true');
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
