
/**
 * Type definitions for Pi Network SDK integration
 */

// Available scopes for authentication
export type Scope = 'username' | 'payments' | 'wallet_address';

// Subscription tiers for feature access
export type SubscriptionTier = 'individual' | 'business' | 'premium';

// Window augmentation to include Pi SDK
declare global {
  interface Window {
    Pi?: {
      init: (options: { version: string; sandbox?: boolean }) => Promise<void>;
      authenticate: (
        scopes: Scope[], 
        onIncompletePaymentFound?: (payment: any) => void
      ) => Promise<{
        accessToken: string;
        user: {
          uid: string;
          username: string;
          roles?: string[];
          walletAddress?: string;
        };
      }>;
      createPayment: (paymentData: any, callbacks: any) => void;
    };
  }
}

// Payment direction types
export type Direction = 'user_to_app' | 'app_to_user';

// Network type
export type AppNetwork = 'Pi Network' | 'Pi Testnet';

// Payment DTO interface
export interface PaymentDTO {
  identifier: string;
  user_uid: string;
  amount: number;
  memo: string;
  metadata: Record<string, any>;
  from_address: string;
  to_address: string;
  direction: Direction;
  created_at: string;
  network: AppNetwork;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}
