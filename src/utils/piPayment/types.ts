
import { SubscriptionTier } from '../piNetwork';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message: string;
}

export type SubscriptionFrequency = 'monthly' | 'yearly';

export interface PricingStructure {
  [tier: string]: {
    monthly: number;
    yearly: number;
  };
}
