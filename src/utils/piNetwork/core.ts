
/**
 * Core utilities for interacting with the Pi Network SDK
 */
import { isPiNetworkAvailable } from './helpers';
import { toast } from 'sonner';

// Flag to track SDK initialization
let isInitialized = false;
let initializationInProgress = false;
let initializationPromise: Promise<boolean> | null = null;

// Initialize the Pi Network SDK with improved error handling and prevention of parallel initialization
export const initializePiNetwork = async (): Promise<boolean> => {
  // If already initialized, return immediately
  if (isInitialized) {
    console.log('Pi Network SDK is already initialized');
    return true;
  }
  
  // If initialization is in progress, return the existing promise
  if (initializationInProgress && initializationPromise) {
    console.log('Pi Network SDK initialization already in progress, waiting...');
    return initializationPromise;
  }
  
  // Set flag and create a new promise
  initializationInProgress = true;
  initializationPromise = new Promise((resolve, reject) => {
    // If SDK is available but not initialized, initialize it
    if (isPiNetworkAvailable()) {
      console.log('Pi Network SDK is loaded, initializing...');
      
      // Ensure Pi.init is a function
      if (!window.Pi || typeof window.Pi.init !== 'function') {
        console.error('Pi.init is not a function or Pi SDK is not properly loaded');
        initializationInProgress = false;
        reject(new Error('Pi Network SDK not properly loaded. Please refresh the page and try again.'));
        return;
      }
      
      window.Pi.init({ version: "2.0" })
        .then(() => {
          console.log('Pi Network SDK initialized successfully');
          isInitialized = true;
          initializationInProgress = false;
          resolve(true);
        })
        .catch(error => {
          console.error('Failed to initialize Pi Network SDK:', error);
          initializationInProgress = false;
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
      if (window.Pi && typeof window.Pi.init === 'function') {
        window.Pi.init({ version: "2.0" })
          .then(() => {
            console.log('Pi Network SDK initialized successfully');
            isInitialized = true;
            initializationInProgress = false;
            resolve(true);
          })
          .catch(error => {
            console.error('Failed to initialize Pi Network SDK:', error);
            initializationInProgress = false;
            reject(error);
          });
      } else {
        const error = new Error('Pi Network SDK loaded but not properly defined');
        console.error(error);
        initializationInProgress = false;
        reject(error);
      }
    };
    
    script.onerror = (error) => {
      console.error('Failed to load Pi Network SDK', error);
      initializationInProgress = false;
      reject(new Error('Failed to load Pi Network SDK'));
    };
    
    // Add timeout for script loading
    const timeout = setTimeout(() => {
      if (!isInitialized) {
        console.error('Pi Network SDK loading timed out');
        initializationInProgress = false;
        reject(new Error('Pi Network SDK loading timed out. Please check your internet connection and try again.'));
      }
    }, 10000); // 10 second timeout
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('Pi Network SDK loaded successfully, initializing...');
      // Initialize the SDK after it's loaded
      if (window.Pi && typeof window.Pi.init === 'function') {
        window.Pi.init({ version: "2.0" })
          .then(() => {
            console.log('Pi Network SDK initialized successfully');
            isInitialized = true;
            initializationInProgress = false;
            resolve(true);
          })
          .catch(error => {
            console.error('Failed to initialize Pi Network SDK:', error);
            initializationInProgress = false;
            reject(error);
          });
      } else {
        const error = new Error('Pi Network SDK loaded but not properly defined');
        console.error(error);
        initializationInProgress = false;
        reject(error);
      }
    };
    
    document.head.appendChild(script);
  });
  
  return initializationPromise;
};

// Check if SDK is initialized
export const isSdkInitialized = (): boolean => {
  return isInitialized;
};

// Wait for SDK to be initialized with timeout
export const waitForSdkInitialization = async (timeoutMs = 5000): Promise<boolean> => {
  const startTime = Date.now();
  
  while (!isInitialized) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('Timed out waiting for Pi Network SDK initialization');
    }
    
    // Wait 100ms before checking again
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return true;
};

// Request additional user permissions including email and payments
export const requestUserPermissions = async (): Promise<{
  email?: string;
  username: string;
  uid: string;
} | null> => {
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK not available');
    toast.error('Pi Network SDK not available. Please refresh the page and try again.');
    return null;
  }
  
  if (!isInitialized) {
    console.log('Pi Network SDK was not initialized. Initializing now...');
    try {
      await initializePiNetwork();
    } catch (error) {
      console.error('Failed to initialize Pi Network SDK:', error);
      toast.error('Failed to initialize Pi Network SDK. Please refresh the page and try again.');
      return null;
    }
  }

  try {
    // Always include 'payments' scope in permission requests
    console.log('Requesting permissions: username, email, payments');
    
    // Correct way to call requestPermissions from the Pi object
    if (!window.Pi || typeof window.Pi.requestPermissions !== 'function') {
      console.error('Pi.requestPermissions is not a function or Pi SDK is not properly loaded');
      toast.error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
      throw new Error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
    }
    
    const result = await window.Pi.requestPermissions(['username', 'email', 'payments']);
    console.log('Permission request result:', result);
    
    if (!result) {
      console.error('Failed to get user permissions - no result returned');
      toast.error('Failed to get user permissions. Please try again.');
      return null;
    }

    return {
      email: result.email,
      username: result.username,
      uid: result.uid
    };
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    toast.error(`Error requesting permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Throw the error so it can be properly handled by the caller
    throw error;
  }
};
