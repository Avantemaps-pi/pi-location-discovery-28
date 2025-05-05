
/**
 * Core utilities for interacting with the Pi Network SDK
 */
import { isPiNetworkAvailable } from './helpers';
import { Scope } from './types';

// Flag to track SDK initialization
let isInitialized = false;
let initializationInProgress = false;
let initializationPromise: Promise<boolean> | null = null;

// Initialize the Pi Network SDK with improved performance
export const initializePiNetwork = async (): Promise<boolean> => {
  // Return cached initialization promise if one is in progress
  if (initializationInProgress && initializationPromise) {
    console.log('Pi Network SDK initialization already in progress, returning existing promise');
    return initializationPromise;
  }
  
  // If SDK is already initialized, resolve immediately
  if (isInitialized) {
    console.log('Pi Network SDK is already initialized');
    return Promise.resolve(true);
  }
  
  // Set flag and create new initialization promise
  initializationInProgress = true;
  
  initializationPromise = new Promise((resolve, reject) => {
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      initializationInProgress = false;
      reject(new Error('Pi Network SDK initialization timed out'));
    }, 15000); // 15 second timeout
    
    // If SDK is available but not initialized, initialize it
    if (isPiNetworkAvailable()) {
      console.log('Pi Network SDK is loaded, initializing...');
      window.Pi!.init({ version: "2.0", sandbox: true }) // Enable sandbox mode for Testnet
        .then(() => {
          console.log('Pi Network SDK initialized successfully');
          isInitialized = true;
          initializationInProgress = false;
          clearTimeout(timeout);
          resolve(true);
        })
        .catch(error => {
          console.error('Failed to initialize Pi Network SDK:', error);
          initializationInProgress = false;
          clearTimeout(timeout);
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
        window.Pi.init({ version: "2.0", sandbox: true }) // Enable sandbox mode for Testnet
          .then(() => {
            console.log('Pi Network SDK initialized successfully');
            isInitialized = true;
            initializationInProgress = false;
            clearTimeout(timeout);
            resolve(true);
          })
          .catch(error => {
            console.error('Failed to initialize Pi Network SDK:', error);
            initializationInProgress = false;
            clearTimeout(timeout);
            reject(error);
          });
      } else {
        const error = new Error('Pi Network SDK loaded but not defined');
        console.error(error);
        initializationInProgress = false;
        clearTimeout(timeout);
        reject(error);
      }
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Pi Network SDK', error);
      initializationInProgress = false;
      clearTimeout(timeout);
      reject(new Error('Failed to load Pi Network SDK'));
    };
    
    document.head.appendChild(script);
  });
  
  return initializationPromise;
};

// Check if SDK is initialized
export const isSdkInitialized = (): boolean => {
  return isInitialized;
};

/**
 * Request additional user permissions with improved error handling
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
  
  // Don't re-initialize if already done
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
    // Set a timeout for authentication
    const authPromise = new Promise<any>((resolve, reject) => {
      const authTimeout = setTimeout(() => {
        reject(new Error('Authentication request timed out'));
      }, 20000); // 20 second timeout
      
      // Use authenticate to request the required scopes as per SDK reference
      console.log('Requesting permissions with authenticate: username, payments, wallet_address');
      const scopes: Scope[] = ['username', 'payments', 'wallet_address'];
      
      window.Pi!.authenticate(scopes, (payment) => {
        console.log('Incomplete payment found during permission request:', payment);
        // Handle incomplete payment if needed
      })
      .then(result => {
        clearTimeout(authTimeout);
        resolve(result);
      })
      .catch(err => {
        clearTimeout(authTimeout);
        reject(err);
      });
    });
    
    const authResult = await authPromise;
    console.log('Permission request result:', authResult);
    
    if (!authResult) {
      console.error('Failed to get user permissions');
      return null;
    }

    // Type assertion to access wallet_address while ensuring TypeScript compatibility
    const authResultWithWallet = authResult as {
      user: {
        uid: string;
        username: string;
        roles?: string[];
        wallet_address?: string;
      };
    };

    return {
      username: authResult.user.username,
      uid: authResult.user.uid,
      walletAddress: authResultWithWallet.user.wallet_address
    };
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    return null;
  }
};
