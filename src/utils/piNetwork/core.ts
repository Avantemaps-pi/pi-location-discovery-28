
/**
 * Core utilities for interacting with the Pi Network SDK
 */
import { isPiNetworkAvailable } from './helpers';

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

// Request additional user permissions including email, wallet_address, and payments
export const requestUserPermissions = async (): Promise<{
  email?: string;
  username: string;
  uid: string;
  walletAddress?: string;
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
    // Include 'payments', 'wallet_address', and 'email' scopes in permission requests
    console.log('Requesting permissions: username, email, payments, wallet_address');
    const result = await window.Pi?.requestPermissions(['username', 'email', 'payments', 'wallet_address']);
    console.log('Permission request result:', result);
    
    if (!result) {
      console.error('Failed to get user permissions');
      return null;
    }

    return {
      email: result.email,
      username: result.username,
      uid: result.uid,
      walletAddress: result.wallet_address
    };
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    return null;
  }
};
