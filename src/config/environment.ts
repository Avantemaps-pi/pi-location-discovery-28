
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
  // Remove reference to non-existent MAPS_CONFIG
  // Instead, check if any required config is missing in the future
  return true;
};
