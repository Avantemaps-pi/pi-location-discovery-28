
/**
 * Core utilities for interacting with the Pi Network SDK
 * This file re-exports functionality from other modules for backwards compatibility
 */

// Re-export initialization-related functions
export { 
  initializePiNetwork,
  isSdkInitialized,
  waitForSdkInitialization,
  validatePiSDK
} from './initialization';

// Re-export permission-related functions
export {
  requestUserPermissions,
  validatePermissionsRequest
} from './permissions';
