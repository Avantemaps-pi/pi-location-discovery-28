
import { SubscriptionTier } from '../piNetwork';
import { PricingStructure } from './types';

// Pricing structure for different subscription tiers
const SUBSCRIPTION_PRICES: PricingStructure = {
  [SubscriptionTier.INDIVIDUAL]: { monthly: 0, yearly: 0 },
  [SubscriptionTier.SMALL_BUSINESS]: { monthly: 5, yearly: 48 },
  [SubscriptionTier.ORGANIZATION]: { monthly: 10, yearly: 96 },
};

// Export the pricing tiers for the UI
export const TIERS = [
  {
    id: "individual",
    name: "Individual",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Basic features for all users",
    features: [
      "AI chat support",
      "1 business listing",
    ],
    cta: "Select Plan",
  },
  {
    id: "small-business",
    name: "Small Business",
    price: {
      monthly: 5,
      yearly: 4,
    },
    description: "Great for active Pi users",
    features: [
      "AI chat support",
      "LIVE chat support",
      "3 business listings",
      "Certificate eligible",
      "Potential Media Coverage",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    id: "organization",
    name: "Organization",
    price: {
      monthly: 10,
      yearly: 8,
    },
    description: "For serious Pi enthusiasts",
    features: [
      "AI chat support",
      "LIVE chat support",
      "5 business listings",
      "Certificate eligible",
      "Media coverage",
      "Personalized media coverage",
      "Access to analytical business data",
      "No ads",
    ],
    cta: "Upgrade Now",
    highlighted: true,
    comingSoon: true,
  },
];

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
