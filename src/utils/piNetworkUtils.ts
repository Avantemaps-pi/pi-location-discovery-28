
/**
 * Utility functions for interacting with the Pi Network SDK
 */

// Define the Pi Network SDK types to extend the global Window interface
declare global {
  interface Window {
    Pi?: {
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
    };
  }
}

// Check if Pi Network SDK is available
export const isPiNetworkAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Pi;
};

// Initialize the Pi Network SDK
export const initializePiNetwork = (): void => {
  // This is a placeholder - the Pi Network SDK is loaded via <script> tag
  // and should be globally available as window.Pi
  if (!isPiNetworkAvailable()) {
    console.warn('Pi Network SDK is not available. Loading from CDN...');
    
    // Create a script element to load the Pi SDK if it's not already available
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('Pi Network SDK loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Pi Network SDK');
    };
    
    document.head.appendChild(script);
  }
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
