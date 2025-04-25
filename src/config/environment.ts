
/**
 * Environment configuration for the application
 */

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

