
/**
 * Environment configuration for the application
 */

// Maps API configuration
export const MAPS_CONFIG = {
  apiKey: "AIzaSyAp6za1pf11Tvq80kIRBpqqunXg4AcYa8s",
  defaultCenter: {
    lat: 37.7749,
    lng: -122.4194,
  },
  defaultZoom: 13,
};

// Pi Network configuration
export const PI_CONFIG = {
  isTestnet: true, // Toggle this value to switch between testnet and mainnet
  sdkVersion: "2.0",
  sandbox: true, // This will be automatically set based on isTestnet
};

// Function to validate that required configuration exists
export const validateEnvConfig = (): boolean => {
  if (!MAPS_CONFIG.apiKey) {
    console.error("Missing Google Maps API key in environment configuration");
    return false;
  }
  return true;
};

