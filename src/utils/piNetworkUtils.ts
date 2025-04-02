
/**
 * Utility functions for interacting with the Pi Network SDK
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
      }>;
      createPayment: (payment: {
        amount: number;
        memo: string;
        metadata?: any;
      }) => Promise<{
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

// Check if Pi Network SDK is available
export const isPiNetworkAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Pi;
};

// Flag to track SDK initialization
let isInitialized = false;

// Initialize the Pi Network SDK
export const initializePiNetwork = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // If SDK is already initialized, resolve immediately
    if (isInitialized) {
      console.log('Pi Network SDK is already initialized');
      resolve(true);
      return;
    }
    
    // If SDK is available but not initialized, initialize it
    if (isPiNetworkAvailable()) {
      console.log('Pi Network SDK is loaded, initializing...');
      window.Pi!.init({ version: "2.0" })
        .then(() => {
          console.log('Pi Network SDK initialized successfully');
          isInitialized = true;
          resolve(true);
        })
        .catch(error => {
          console.error('Failed to initialize Pi Network SDK:', error);
          reject(error);
        });
      return;
    }
    
    console.log('Loading Pi Network SDK from CDN...');
    
    // Create a script element to load the Pi SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    
    script.onload = () => {
      console.log('Pi Network SDK loaded successfully, initializing...');
      // Initialize the SDK after it's loaded
      if (window.Pi) {
        window.Pi.init({ version: "2.0" })
          .then(() => {
            console.log('Pi Network SDK initialized successfully');
            isInitialized = true;
            resolve(true);
          })
          .catch(error => {
            console.error('Failed to initialize Pi Network SDK:', error);
            reject(error);
          });
      } else {
        const error = new Error('Pi Network SDK loaded but not defined');
        console.error(error);
        reject(error);
      }
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Pi Network SDK', error);
      reject(new Error('Failed to load Pi Network SDK'));
    };
    
    document.head.appendChild(script);
  });
};

// Check if SDK is initialized
export const isSdkInitialized = (): boolean => {
  return isInitialized;
};

// Check if a session is expired
export const isSessionExpired = (lastAuthenticated: number, timeout: number): boolean => {
  return Date.now() - lastAuthenticated > timeout;
};

// Request additional user permissions including email
export const requestUserPermissions = async (): Promise<{
  email?: string;
  username: string;
  uid: string;
} | null> => {
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK not available');
    return null;
  }
  
  if (!isInitialized) {
    console.error('Pi Network SDK was not initialized. Call init() before any other method.');
    try {
      await initializePiNetwork();
    } catch (error) {
      console.error('Failed to initialize Pi Network SDK:', error);
      return null;
    }
  }

  try {
    const result = await window.Pi?.requestPermissions(['username', 'email']);
    if (!result) {
      console.error('Failed to get user permissions');
      return null;
    }

    return {
      email: result.email,
      username: result.username,
      uid: result.uid
    };
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    return null;
  }
};

// Enum for subscription tiers
export enum SubscriptionTier {
  INDIVIDUAL = 'individual',
  SMALL_BUSINESS = 'small-business',
  ORGANIZATION = 'organization',
}

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
