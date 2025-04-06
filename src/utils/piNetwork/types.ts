
/**
 * Type definitions for the Pi Network SDK
 */

// Define the Pi Network SDK types to extend the global Window interface
declare global {
  interface Window {
    Pi?: {
      init: (options?: { version?: string }) => Promise<void>;
      authenticate: (
        scopes: string[], 
        onIncompletePaymentFound?: (payment: any) => void
      ) => Promise<{
        accessToken: string;
        user: {
          uid: string;
          username: string;
          roles?: string[];
        };
      }>;
      requestPermissions: (permissions: string[]) => Promise<{
        uid: string;
        username: string;
        credentials: any[];
        accessToken: string;
        email?: string;
        wallet_address?: string;
      }>;
      createPayment: (
        payment: {
          amount: number;
          memo: string;
          metadata?: any;
        },
        callbacks?: {
          onReadyForServerApproval?: (paymentId: string) => void;
          onReadyForServerCompletion?: (paymentId: string, txid: string) => void;
          onCancel?: (paymentId: string) => void;
          onError?: (error: Error, payment?: any) => void;
        }
      ) => Promise<{
        identifier: string;
        user_uid: string;
        amount: number;
        memo: string;
        metadata: any;
        status: string;
        transaction?: any;
      }>;
      submitPayment: (paymentId: string) => Promise<{
        status: string;
        transaction?: {
          txid: string;
          verified: boolean;
          _link: string;
        };
      }>;
    };
  }
}

// Enum for subscription tiers
export enum SubscriptionTier {
  INDIVIDUAL = 'individual',
  SMALL_BUSINESS = 'small-business',
  ORGANIZATION = 'organization',
}
