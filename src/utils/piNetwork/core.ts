
/**
 * Core utilities for interacting with the Pi Network SDK
 */
import { isPiNetworkAvailable } from './helpers';
import { Scope } from './types';

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
      // Use v2 of the SDK for mainnet compatibility
      const sdkVersion = "2.0";
      console.log(`Initializing Pi SDK with version ${sdkVersion}`);
      
      window.Pi!.init({ version: sdkVersion })
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
      // Initialize the SDK after it's loaded with v2
      if (window.Pi) {
        const sdkVersion = "2.0";
        console.log(`Initializing Pi SDK with version ${sdkVersion}`);
        
        window.Pi.init({ version: sdkVersion })
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

/**
 * Request additional user permissions
 * According to SDK documentation, this should request any scopes that may have been rejected 
 * or not requested previously
 */
export const requestUserPermissions = async (): Promise<{
  username: string;
  uid: string;
  walletAddress?: string;
} | null> => {
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK not available');
    return null;
  }
  
  if (!isInitialized) {
    console.log('Pi Network SDK was not initialized. Initializing now...');
    try {
      await initializePiNetwork();
    } catch (error) {
      console.error('Failed to initialize Pi Network SDK:', error);
      return null;
    }
  }

  try {
    // Use authenticate to request the required scopes as per SDK reference
    console.log('Requesting permissions with authenticate: username, payments, wallet_address');
    const scopes: Scope[] = ['username', 'payments', 'wallet_address'];
    
    const authResult = await window.Pi?.authenticate(scopes, (payment) => {
      console.log('Incomplete payment found during permission request:', payment);
      // Handle incomplete payment if needed
    });
    
    console.log('Permission request result:', authResult);
    
    if (!authResult) {
      console.error('Failed to get user permissions');
      return null;
    }

    // Check if wallet_address permission was granted
    const hasWalletPermission = authResult.user.roles?.includes('wallet_address');
    console.log('Has wallet_address permission:', hasWalletPermission);

    // Extract wallet address if available from user properties
    // The SDK documentation shows wallet_address should be accessible at authResult.user.wallet_address
    // when the wallet_address scope is granted
    const walletAddress = hasWalletPermission ? 
      (authResult as any).user.wallet_address : undefined;
    
    if (walletAddress) {
      console.log('Wallet address permission granted:', walletAddress);
    } else {
      console.warn('Wallet address permission not granted or address not available');
    }

    return {
      username: authResult.user.username,
      uid: authResult.user.uid,
      walletAddress: walletAddress
    };
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    return null;
  }
};

/**
 * Request wallet address permission explicitly
 * This function is specifically used when wallet_address permission is required
 * for payment operations
 */
export const requestWalletPermission = async (): Promise<string | null> => {
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK not available');
    return null;
  }
  
  try {
    console.log('Specifically requesting wallet_address permission');
    // Make a focused request just for wallet_address permission
    const authResult = await window.Pi?.authenticate(['wallet_address'], (payment) => {
      console.log('Incomplete payment found during wallet address request:', payment);
    });
    
    if (!authResult) {
      console.error('Failed to get wallet_address permission');
      return null;
    }
    
    // Check if wallet_address permission was granted
    const hasWalletPermission = authResult.user.roles?.includes('wallet_address');
    
    // Extract wallet address if available
    const walletAddress = hasWalletPermission ? 
      (authResult as any).user.wallet_address : null;
    
    if (walletAddress) {
      console.log('Wallet address permission successfully granted:', walletAddress);
      return walletAddress;
    } else {
      console.warn('Wallet address permission was not granted');
      return null;
    }
  } catch (error) {
    console.error('Error requesting wallet address permission:', error);
    return null;
  }
};
