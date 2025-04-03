
import { SubscriptionTier } from '../piNetwork';
import { PricingStructure } from './types';

// Pricing structure for different subscription tiers
const SUBSCRIPTION_PRICES: PricingStructure = {
  [SubscriptionTier.INDIVIDUAL]: { monthly: 0, yearly: 0 },
  [SubscriptionTier.SMALL_BUSINESS]: { monthly: 5, yearly: 48 },
  [SubscriptionTier.ORGANIZATION]: { monthly: 10, yearly: 96 },
};

/**
 * Determines the correct price based on tier and frequency
 */
export const getSubscriptionPrice = (
  tier: SubscriptionTier,
  frequency: string
): number => {
  // Default to monthly price if frequency is invalid
  const validFrequency = frequency === 'yearly' ? 'yearly' : 'monthly';
  
  // Convert yearly price to correct amount (monthly price × 12 × 0.8 for 20% discount)
  if (validFrequency === 'yearly' && typeof SUBSCRIPTION_PRICES[tier].monthly === 'number') {
    return SUBSCRIPTION_PRICES[tier].monthly * 12 * 0.8;
  }
  
  return SUBSCRIPTION_PRICES[tier][validFrequency] || 0;
};
