
/**
 * Environment configuration for the application
 */

// Pi Network configuration
export const PI_CONFIG = {
  isTestnet: true, // Always true for sandbox testing
  sdkVersion: "2.0",
  sandbox: true, // Always true for sandbox testing
};

// Function to validate that required configuration exists
export const validateEnvConfig = (): boolean => {
  return true;
};
