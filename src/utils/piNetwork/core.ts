/**
 * Core utilities for interacting with the Pi Network SDK
 */
import { isPiNetworkAvailable } from './helpers';
import { Scope } from './types';
import { PI_CONFIG } from '@/config/environment';

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
      console.log(`Initializing Pi SDK with version ${PI_CONFIG.sdkVersion} in sandbox mode`);
      
      window.Pi!.init({ 
        version: PI_CONFIG.sdkVersion,
        sandbox: true // Always true for sandbox testing
      })
        .then(() => {
          console.log('Pi Network SDK initialized successfully in sandbox mode');
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
      console.log('Pi Network SDK loaded successfully, initializing in sandbox mode...');
      // Initialize the SDK after it's loaded
      if (window.Pi) {
        console.log(`Initializing Pi SDK with version ${PI_CONFIG.sdkVersion} in sandbox mode`);
        
        window.Pi.init({ 
          version: PI_CONFIG.sdkVersion,
          sandbox: true // Always true for sandbox testing
        })
          .then(() => {
            console.log('Pi Network SDK initialized successfully in sandbox mode');
            isInitialized = true;
            resolve(true);
          })
          .catch(error => {
            console.error('Failed to initialize Pi SDK:', error);
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
      console.error('Failed to get user permissions - authentication was null or undefined');
      return null;
    }

    // Safely extract wallet address if permission was granted
    let walletAddress: string | undefined = undefined;
    
    // Check if wallet_address permission was granted (using roles array)
    const hasWalletPermission = authResult.user.roles?.includes('wallet_address');
    console.log('Has wallet_address permission:', hasWalletPermission);

    if (hasWalletPermission && 'wallet_address' in authResult.user) {
      const userWalletAddress = authResult.user.wallet_address as string;
      if (userWalletAddress) {
        walletAddress = userWalletAddress;
        console.log('Wallet address permission granted:', walletAddress);
      }
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
    // Ensure SDK is initialized before requesting permissions
    if (!isInitialized) {
      console.log('Pi Network SDK was not initialized. Initializing now...');
      try {
        await initializePiNetwork();
      } catch (error) {
        console.error('Failed to initialize Pi Network SDK:', error);
        return null;
      }
    }
    
    console.log('Specifically requesting wallet_address permission');
    // Make a focused request just for wallet_address permission
    const authResult = await window.Pi?.authenticate(['wallet_address'], (payment) => {
      console.log('Incomplete payment found during wallet address request:', payment);
    });
    
    if (!authResult) {
      console.error('Failed to get wallet_address permission - authentication was null or undefined');
      return null;
    }
    
    // Check if wallet_address permission was granted using roles array
    const hasWalletPermission = authResult.user.roles?.includes('wallet_address');
    
    if (hasWalletPermission && 'wallet_address' in authResult.user) {
      const walletAddress = authResult.user.wallet_address as string;
      if (walletAddress) {
        console.log('Wallet address permission successfully granted:', walletAddress);
        return walletAddress;
      }
    }
    
    console.warn('Wallet address permission was not granted or address is not available');
    return null;
  } catch (error) {
    console.error('Error requesting wallet address permission:', error);
    return null;
  }
};
