
import { isPiNetworkAvailable } from './helpers';
import { PI_CONFIG } from '@/config/environment';

// Flag to track SDK initialization
let isInitialized = false;
let isInitializing = false;
let initializationPromise: Promise<boolean> | null = null;

// Initialize the Pi Network SDK
export const initializePiNetwork = async (): Promise<boolean> => {
  // If already initialized, return immediately
  if (isInitialized) {
    console.log('Pi Network SDK is already initialized');
    return true;
  }

  // If initialization is in progress, wait for it to complete
  if (isInitializing && initializationPromise) {
    console.log('Pi Network SDK initialization already in progress, waiting...');
    return initializationPromise;
  }

  // Set initializing flag and create a new promise
  isInitializing = true;
  initializationPromise = new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Pi Network SDK initialization timed out'));
    }, 10000); // 10 second timeout
    
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
          console.log(`Pi Network SDK initialized successfully in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
          isInitialized = true;
          isInitializing = false;
          resolve(true);
        })
        .catch(error => {
          clearTimeout(timeoutId);
          console.error('Failed to initialize Pi Network SDK:', error);
          isInitializing = false;
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
    
    script.onload = () => {
      console.log(`Pi Network SDK loaded successfully, initializing in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode...`);
      // Initialize the SDK after it's loaded
      if (window.Pi) {
        console.log(`Initializing Pi SDK with version ${PI_CONFIG.sdkVersion} in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
        
        window.Pi.init({ 
          version: PI_CONFIG.sdkVersion,
          sandbox: PI_CONFIG.isTestnet // Use sandbox mode only for testnet
        })
          .then(() => {
            clearTimeout(timeoutId);
            console.log(`Pi Network SDK initialized successfully in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
            isInitialized = true;
            isInitializing = false;
            resolve(true);
          })
          .catch(error => {
            clearTimeout(timeoutId);
            console.error('Failed to initialize Pi SDK:', error);
            isInitializing = false;
            reject(error);
          });
      } else {
        clearTimeout(timeoutId);
        const error = new Error('Pi Network SDK loaded but not defined');
        console.error(error);
        isInitializing = false;
        reject(error);
      }
    };
    
    script.onerror = (error) => {
      clearTimeout(timeoutId);
      console.error('Failed to load Pi Network SDK', error);
      isInitializing = false;
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
