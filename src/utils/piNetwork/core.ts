
/**
 * Core utilities for interacting with the Pi Network SDK
 */
import { isPiNetworkAvailable, isRunningInPiBrowser } from './helpers';
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
    
    // If we're not in Pi Browser, provide a more specific message
    if (!isRunningInPiBrowser()) {
      console.log('Not running in Pi Browser - limited functionality available');
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

    // Extract wallet address directly from the auth result
    // This is the corrected way to access wallet_address from the SDK response
    return {
      username: authResult.user.username,
      uid: authResult.user.uid,
      walletAddress: (authResult as any).user.wallet_address
    };
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    return null;
  }
};
