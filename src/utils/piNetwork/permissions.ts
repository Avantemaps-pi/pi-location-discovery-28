
/**
 * Pi Network SDK permission utilities
 */
import { isPiNetworkAvailable } from './helpers';
import { initializePiNetwork, isSdkInitialized } from './initialization';
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
  
  if (!isSdkInitialized()) {
    console.log('Pi Network SDK was not initialized. Initializing now...');
    try {
      await initializePiNetwork();
    } catch (error) {
      console.error('Failed to initialize Pi Network SDK:', error);
      toast.error('Failed to initialize Pi Network SDK. Please refresh the page and try again.');
      return null;
    }
  }

  // Validate permissions request is possible
  if (!validatePermissionsRequest()) {
    toast.error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
    throw new Error('Pi Network SDK not properly loaded. Please refresh the page and try again.');
  }

  try {
    // Always include 'payments' scope in permission requests
    console.log('Requesting permissions: username, email, payments');
    
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
  } catch (error) {
    console.error('Error requesting user permissions:', error);
    toast.error(`Error requesting permissions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    // Throw the error so it can be properly handled by the caller
    throw error;
  }
};
