
/**
 * Pi Network SDK permission utilities
 */
import { isPiNetworkAvailable } from './helpers';
import { initializePiNetwork, isSdkInitialized, waitForSdkInitialization } from './initialization';
import { toast } from 'sonner';

// Validate that permissions can be requested
export const validatePermissionsRequest = (): boolean => {
  if (!window.Pi) {
    console.error('Pi object is not available');
    return false;
  }
  
  if (typeof window.Pi.requestPermissions !== 'function') {
    console.error('Pi.requestPermissions is not a function');
    return false;
  }
  
  return true;
};

// Request additional user permissions including email and payments
export const requestUserPermissions = async (): Promise<{
  email?: string;
  username: string;
  uid: string;
} | null> => {
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK not available');
    toast.error('Pi Network SDK not available. Please refresh the page and try again.');
    return null;
  }
  
  // Make sure SDK is initialized and wait for it if needed
  if (!isSdkInitialized()) {
    console.log('Pi Network SDK was not initialized. Initializing now...');
    try {
      await initializePiNetwork();
      
      // Double check that initialization worked and wait for it if needed (up to 5 seconds)
      try {
        console.log('Waiting for SDK initialization to complete...');
        await waitForSdkInitialization(5000); // Extend timeout to 5 seconds
        console.log('SDK initialization completed successfully');
      } catch (error) {
        console.error('Timed out waiting for SDK initialization', error);
        toast.error('Failed to initialize Pi Network SDK. Please refresh the page and try again.');
        return null;
      }
    } catch (error) {
      console.error('Failed to initialize Pi Network SDK:', error);
      toast.error('Failed to initialize Pi Network SDK. Please refresh the page and try again.');
      return null;
    }
  } else {
    console.log('Pi Network SDK is already initialized');
  }

  // Double-check SDK is available after initialization attempt
  if (!isPiNetworkAvailable()) {
    console.error('Pi Network SDK still not available after initialization');
    toast.error('Pi Network SDK not available. Please refresh the page and try again.');
    return null;
  }

  // Double check Pi object is available at this point
  if (!window.Pi) {
    console.error('Pi object is unexpectedly not available after availability check');
    toast.error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
    return null;
  }

  // Validate permissions request is possible
  if (!validatePermissionsRequest()) {
    console.error('Pi SDK methods not available');
    toast.error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
    throw new Error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
  }

  try {
    // Always include 'payments' scope in permission requests
    console.log('Requesting permissions: username, email, payments');
    
    // Ensure the window.Pi object is ready
    if (window.Pi && typeof window.Pi.requestPermissions === 'function') {
      const result = await window.Pi.requestPermissions(['username', 'email', 'payments']);
      console.log('Permission request result:', result);
      
      if (!result) {
        console.error('Failed to get user permissions - no result returned');
        toast.error('Failed to get user permissions. Please try again.');
        return null;
      }

      return {
        email: result.email,
        username: result.username,
        uid: result.uid
      };
    } else {
      console.error('Pi SDK requestPermissions method not available at execution time');
      toast.error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
      return null;
    }
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    toast.error(`Error requesting permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Throw the error so it can be properly handled by the caller
    throw error;
  }
};
