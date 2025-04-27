/**
 * Environment configuration for the application
 */

// Detect if the URL has a sandbox query parameter (?sandbox=true)
const urlParams = new URLSearchParams(window.location.search);
const sandboxOverride = urlParams.get('sandbox') === 'true';

// Determine if we are in a Sandbox/Testnet environment based on hostname
const isSandboxEnvironment = window.location.hostname.includes("sandbox") || window.location.hostname.includes("testnet");

// Final decision: either based on URL override or hostname detection
const useSandbox = sandboxOverride || isSandboxEnvironment;

// Pi Network configuration
export const PI_CONFIG = {
  sdkVersion: "2.0",          // Pi SDK version to use
  isTestnet: useSandbox,      // Automatically true if sandbox or override detected
  sandbox: useSandbox,        // Same as above
};

/**
 * Function to validate that required environment configuration exists.
 * Can be extended later to check specific environment variables.
 */
export const validateEnvConfig = (): boolean => {
  return !!(PI_CONFIG.sdkVersion);
};
