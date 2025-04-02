
import { PiUser } from './types';
import { SubscriptionTier } from '@/utils/piNetworkUtils';
import { supabase } from '@/integrations/supabase/client';

// Update user data in Supabase and local storage
export const updateUserData = async (userData: PiUser, setUser: (user: PiUser) => void): Promise<void> => {
  try {
    // Save to Supabase if we have a valid connection
    const { error } = await supabase
      .from('users')
      .upsert({
        uid: userData.uid,
        username: userData.username,
        email: userData.email,
        subscription_tier: userData.subscriptionTier,
        last_login: new Date().toISOString()
      }, {
        onConflict: 'uid'
      });

    if (error) {
      console.error("Error updating user in Supabase:", error);
    }

    // Save to localStorage
    localStorage.setItem('avante_maps_auth', JSON.stringify(userData));
    setUser(userData);
  } catch (error) {
    console.error("Error updating user data:", error);
  }
};

// Get user's subscription from Supabase
export const getUserSubscription = async (uid: string): Promise<SubscriptionTier> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('subscription_tier')
      .eq('uid', uid)
      .single();

    if (error || !data) {
      console.error("Error fetching subscription:", error);
      return SubscriptionTier.INDIVIDUAL; // Default to INDIVIDUAL if error
    }

    return data.subscription_tier as SubscriptionTier || SubscriptionTier.INDIVIDUAL;
  } catch (error) {
    console.error("Error in getUserSubscription:", error);
    return SubscriptionTier.INDIVIDUAL;
  }
};

// Check if user has access to a feature based on their subscription
export const checkAccess = (userTier: SubscriptionTier, requiredTier: SubscriptionTier): boolean => {
  const tierLevel = {
    [SubscriptionTier.INDIVIDUAL]: 0,
    [SubscriptionTier.SMALL_BUSINESS]: 1,
    [SubscriptionTier.ORGANIZATION]: 2,
  };

  const userLevel = tierLevel[userTier] || 0;
  const requiredLevel = tierLevel[requiredTier];

  return userLevel >= requiredLevel;
};
