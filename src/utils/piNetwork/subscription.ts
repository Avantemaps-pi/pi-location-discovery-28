
/**
 * Subscription and access-related utilities
 */
import { SubscriptionTier } from './types';

// Check if a user has access to a feature based on their subscription
export const hasFeatureAccess = (userTier: SubscriptionTier | string, requiredTier: SubscriptionTier): boolean => {
  const tierLevel = {
    [SubscriptionTier.INDIVIDUAL]: 0,
    [SubscriptionTier.SMALL_BUSINESS]: 1,
    [SubscriptionTier.ORGANIZATION]: 2,
  };

  // Default to INDIVIDUAL if tier is unknown
  const userLevel = tierLevel[userTier as SubscriptionTier] || 0;
  const requiredLevel = tierLevel[requiredTier];

  return userLevel >= requiredLevel;
};
