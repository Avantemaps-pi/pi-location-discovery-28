
/**
 * Pi Network SDK initialization utilities
 */
import { isPiNetworkAvailable } from './helpers';
import { toast } from 'sonner';

// Flag to track SDK initialization
let isInitialized = false;
let initializationInProgress = false;
let initializationPromise: Promise<boolean> | null = null;
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 3;

// Check Pi object availability and properties
export const validatePiSDK = (): boolean => {
  if (!window.Pi) {
    console.error('Pi SDK object is not available');
    return false;
  }

  if (typeof window.Pi.init !== 'function') {
    console.error('Pi.init is not a function');
    return false;
  }

  return true;
};

// Reset initialization state - useful for retrying after failures
const resetInitializationState = (): void => {
  initializationInProgress = false;
  initializationPromise = null;
};

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
  initializationAttempts++;
  
  console.log(`Pi Network SDK initialization attempt ${initializationAttempts}`);
  
  if (initializationAttempts > MAX_INITIALIZATION_ATTEMPTS) {
    console.error(`Max initialization attempts (${MAX_INITIALIZATION_ATTEMPTS}) reached`);
    toast.error("Failed to initialize Pi Network after multiple attempts. Please refresh the page.");
    resetInitializationState();
    return false;
  }

  initializationPromise = new Promise((resolve, reject) => {
    // If SDK is available but not initialized, initialize it
    if (isPiNetworkAvailable()) {
      console.log('Pi Network SDK is loaded, initializing...');
      
      // Ensure Pi SDK is valid
      if (!validatePiSDK()) {
        console.error('Pi Network SDK not properly loaded');
        resetInitializationState();
        reject(new Error('Pi Network SDK not properly loaded. Please refresh the page and try again.'));
        return;
      }
      
      // Add timeout for initialization
      const initTimeout = setTimeout(() => {
        console.error('Pi Network SDK initialization timed out');
        resetInitializationState();
        reject(new Error('Pi Network SDK initialization timed out'));
      }, 10000);
      
      window.Pi.init({ version: "2.0" })
        .then(() => {
          clearTimeout(initTimeout);
          console.log('Pi Network SDK initialized successfully');
          isInitialized = true;
          resetInitializationState();
          resolve(true);
        })
        .catch(error => {
          clearTimeout(initTimeout);
          console.error('Failed to initialize Pi Network SDK:', error);
          resetInitializationState();
          reject(error);
        });
      return;
    }
    
    console.log('Loading Pi Network SDK from CDN...');
    
    // Check if the script is already in the document
    const existingScript = document.querySelector('script[src="https://sdk.minepi.com/pi-sdk.js"]');
    if (existingScript) {
      console.log('Pi SDK script already exists in document, removing and re-adding it');
      existingScript.remove();
    }
    
    // Create a script element to load the Pi SDK
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    
    // Add timeout for script loading
    const timeout = setTimeout(() => {
      console.error('Pi Network SDK loading timed out');
      resetInitializationState();
      reject(new Error('Pi Network SDK loading timed out. Please check your internet connection and try again.'));
    }, 15000); // 15 second timeout for loading
    
    script.onload = () => {
      clearTimeout(timeout);
      console.log('Pi Network SDK loaded successfully, initializing...');
      
      // Validate the SDK after loading
      if (!validatePiSDK()) {
        resetInitializationState();
        reject(new Error('Pi Network SDK loaded but not properly defined'));
        return;
      }
      
      // Initialize the SDK after it's loaded
      window.Pi.init({ version: "2.0" })
        .then(() => {
          console.log('Pi Network SDK initialized successfully');
          isInitialized = true;
          resetInitializationState();
          resolve(true);
        })
        .catch(error => {
          console.error('Failed to initialize Pi Network SDK:', error);
          resetInitializationState();
          reject(error);
        });
    };
    
    script.onerror = (error) => {
      clearTimeout(timeout);
      console.error('Failed to load Pi Network SDK', error);
      resetInitializationState();
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

// Wait for SDK to be initialized with timeout
export const waitForSdkInitialization = async (timeoutMs = 5000): Promise<boolean> => {
  const startTime = Date.now();
  console.log(`Waiting for SDK initialization with ${timeoutMs}ms timeout`);
  
  while (!isInitialized) {
    if (Date.now() - startTime > timeoutMs) {
      console.error(`Timed out after ${timeoutMs}ms waiting for Pi Network SDK initialization`);
      throw new Error('Timed out waiting for Pi Network SDK initialization');
    }
    
    // Wait 100ms before checking again
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log('SDK initialization confirmed');
  return true;
};
