
import { isPiNetworkAvailable } from './helpers';
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
      console.log(`Initializing Pi SDK with version ${PI_CONFIG.sdkVersion} in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
      
      window.Pi!.init({ 
        version: PI_CONFIG.sdkVersion,
        sandbox: PI_CONFIG.isTestnet // Use sandbox mode only for testnet
      })
        .then(() => {
          console.log(`Pi Network SDK initialized successfully in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
          isInitialized = true;
          resolve(true);
        })
        .catch(error => {
          console.error('Failed to initialize Pi Network SDK:', error);
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
            console.log(`Pi Network SDK initialized successfully in ${PI_CONFIG.isTestnet ? 'testnet' : 'mainnet'} mode`);
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
