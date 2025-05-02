
import { toast } from 'sonner';
import { isPiNetworkAvailable, initializePiNetwork } from '@/utils/piNetwork';

/**
 * Request permissions before authenticating
 */
export const requestAuthPermissions = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void
): Promise<boolean> => {
  if (!isSdkInitialized) {
    toast.warning("Pi Network SDK is initializing. Please try again in a moment.");
    return false;
  }

  setIsLoading(true);
  setAuthError(null);

  try {
    // Check if online
    if (!navigator.onLine) {
      toast.warning("You're offline. Authentication will resume when you're back online.");
      setIsLoading(false);
      return false;
    }

    // Check if Pi SDK is available
    if (!isPiNetworkAvailable()) {
      throw new Error("Pi Network SDK is not available");
    }

    // Ensure SDK is initialized before requesting permissions
    try {
      await initializePiNetwork();
    } catch (error) {
      throw new Error("Failed to initialize Pi Network SDK");
    }

    // Request permissions with Pi Network
    const userInfo = await window.Pi!.authenticate(['username', 'payments', 'wallet_address'], (payment) => {
      console.log('Incomplete payment found:', payment);
    });
    
    if (userInfo) {
      console.log("Permission request successful");
      toast.success("Permissions granted. Proceeding with authentication.");
      return true;
    } else {
      throw new Error("Permission request failed or was denied");
    }
  } catch (error) {
    let errorMessage = "Permission request failed";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    setAuthError(errorMessage);
    toast.error(errorMessage);
    console.error("Permission error:", error);
    return false;
  } finally {
    setIsLoading(false);
  }
};
