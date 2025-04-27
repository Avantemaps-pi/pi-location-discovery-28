/**
 * Environment configuration for the application
 */

// Determine if the current environment is Pi Testnet/Sandbox based on the domain
const isSandboxEnvironment = window.location.hostname.includes("sandbox") || window.location.hostname.includes("testnet");

// Pi Network configuration
export const PI_CONFIG = {
  sdkVersion: "2.0",              // Pi SDK version to use
  isTestnet: isSandboxEnvironment, // Automatically true if in sandbox/testnet environment
  sandbox: isSandboxEnvironment,   // Automatically true if in sandbox/testnet environment
};

/**
 * Function to validate that required environment configuration exists.
 * Can be extended later to check specific environment variables.
 */
export const validateEnvConfig = (): boolean => {
  return !!(PI_CONFIG.sdkVersion);
};
