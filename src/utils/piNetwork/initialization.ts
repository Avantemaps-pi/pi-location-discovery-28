
import { isPiNetworkAvailable } from './helpers';
import { PI_CONFIG } from '@/config/environment';

// Flag to track SDK initialization
let isInitialized = false;
let isInitializing = false;
let initializationPromise: Promise<boolean> | null = null;
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 3;

// Initialize the Pi Network SDK with performance optimizations
export const initializePiNetwork = async (): Promise<boolean> => {
  // If already initialized, return immediately
  if (isInitialized) {
    return true;
  }

  // If initialization is in progress, wait for it to complete
  if (isInitializing && initializationPromise) {
    return initializationPromise;
  }

  // Set initializing flag and create a new promise
  isInitializing = true;
  
  // Track initialization time for performance monitoring
  const startTime = performance.now();
  
  initializationPromise = new Promise((resolve, reject) => {
    // Shorter timeout for faster failure detection
    const timeoutId = setTimeout(() => {
      console.error(`Pi Network SDK initialization timed out (attempt ${initializationAttempts + 1}/${MAX_INITIALIZATION_ATTEMPTS})`);
      isInitializing = false;
      
      // If we haven't exceeded max attempts, we'll let the next call try again
      if (initializationAttempts >= MAX_INITIALIZATION_ATTEMPTS) {
        reject(new Error('Pi Network SDK initialization failed after max attempts'));
      } else {
        resolve(false); // Return false but don't throw, allowing retry
      }
    }, 5000); // 5 second timeout (reduced from 10s)
    
    // If SDK is available but not initialized, initialize it
    if (isPiNetworkAvailable()) {
      console.log('Pi Network SDK is loaded, initializing...');
      console.log(`Initializing Pi SDK with version ${PI_CONFIG.sdkVersion} in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
      
      window.Pi!.init({ 
        version: PI_CONFIG.sdkVersion,
        sandbox: PI_CONFIG.isTestnet // Use sandbox mode only for testnet
      })
        .then(() => {
          clearTimeout(timeoutId);
          const initTime = performance.now() - startTime;
          console.log(`Pi Network SDK initialized successfully in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode (${Math.round(initTime)}ms)`);
          isInitialized = true;
          isInitializing = false;
          initializationAttempts = 0; // Reset attempts on success
          resolve(true);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.error('Failed to initialize Pi Network SDK:', error);
          isInitializing = false;
          initializationAttempts++;
          reject(error);
        });
      return;
    }
    
    // Determine the correct SDK URL based on environment
    const sdkUrl = PI_CONFIG.isTestnet 
      ? 'https://sdk.testnet.minepi.com/pi-sdk.js' 
      : 'https://sdk.minepi.com/pi-sdk.js';
    
    console.log(`Loading Pi Network SDK from ${sdkUrl}...`);
    
    // Create a script element to load the Pi SDK
    const script = document.createElement('script');
    script.src = sdkUrl;
    script.async = true;
    
    // Use browser performance API to track loading time
    const scriptStartTime = performance.now();
    
    script.onload = () => {
      const loadTime = performance.now() - scriptStartTime;
      console.log(`Pi Network SDK loaded successfully (${Math.round(loadTime)}ms), initializing in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode...`);
      
      // Initialize the SDK after it's loaded
      if (window.Pi) {
        console.log(`Initializing Pi SDK with version ${PI_CONFIG.sdkVersion} in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
        
        window.Pi.init({ 
          version: PI_CONFIG.sdkVersion,
          sandbox: PI_CONFIG.isTestnet
        })
          .then(() => {
            clearTimeout(timeoutId);
            const totalTime = performance.now() - startTime;
            console.log(`Pi Network SDK initialized successfully in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode (${Math.round(totalTime)}ms)`);
            isInitialized = true;
            isInitializing = false;
            initializationAttempts = 0; // Reset attempts on success
            resolve(true);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            console.error('Failed to initialize Pi SDK:', error);
            isInitializing = false;
            initializationAttempts++;
            reject(error);
          });
      } else {
        clearTimeout(timeoutId);
        const error = new Error('Pi Network SDK loaded but not defined');
        console.error(error);
        isInitializing = false;
        initializationAttempts++;
        reject(error);
      }
    };
    
    script.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error('Failed to load Pi Network SDK', error);
      isInitializing = false;
      initializationAttempts++;
      reject(new Error('Failed to load Pi Network SDK'));
    };
    
    document.head.appendChild(script);
  });
  
  return initializationPromise;
};

// Check if SDK is initialized (fast synchronous check)
export const isSdkInitialized = (): boolean => {
  return isInitialized;
};

// Get initialization status details
export const getSdkStatus = () => {
  return {
    isInitialized,
    isInitializing,
    attempts: initializationAttempts,
    maxAttempts: MAX_INITIALIZATION_ATTEMPTS
  };
};
