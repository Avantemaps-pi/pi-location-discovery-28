
import { toast } from 'sonner';
import { PiUser } from './types';
import { 
  isPiNetworkAvailable, 
  initializePiNetwork,
  requestUserPermissions,
  isSdkInitialized,
  waitForSdkInitialization,
  SubscriptionTier,
  validatePiSDK 
} from '@/utils/piNetwork';
import { getUserSubscription, updateUserData } from './authUtils';

// Helper function to verify the Pi SDK authentication method is available
const validateAuthenticateMethod = (): boolean => {
  if (!window.Pi) {
    console.error('Pi object is not available');
    return false;
  }
  
  if (typeof window.Pi.authenticate !== 'function') {
    console.error('Pi.authenticate is not a function');
    return false;
  }
  
  return true;
};

export const performLogin = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  setPendingAuth: (pending: boolean) => void,
  setUser: (user: PiUser | null) => void
): Promise<void> => {
  console.log("Starting login process, SDK initialized:", isSdkInitialized);
  
  // Don't attempt login if SDK is not initialized yet
  if (!isSdkInitialized) {
    setPendingAuth(true);
    toast.warning("Pi Network SDK is initializing. Please try again in a moment.");
    return;
  }
  
  setIsLoading(true);
  setAuthError(null);

  try {
    // Check if online
    if (!navigator.onLine) {
      setPendingAuth(true);
      toast.warning("You're offline. Authentication will resume when you're back online.");
      setIsLoading(false);
      return;
    }

    // Check if Pi SDK is available
    if (!isPiNetworkAvailable()) {
      console.error("Pi Network SDK is not available");
      toast.error("Pi Network SDK is not available. Please refresh the page and try again.");
      throw new Error("Pi Network SDK is not available");
    }

    // Ensure SDK is initialized before authentication and wait for it
    try {
      console.log("Double-checking SDK initialization before authentication");
      await initializePiNetwork();
      
      // Double check that initialization worked and wait for it if needed
      if (!isSdkInitialized()) {
        console.log("SDK not marked as initialized, waiting...");
        try {
          await waitForSdkInitialization(5000); // Extend timeout to 5 seconds
          console.log("SDK initialization confirmed");
        } catch (timeoutError) {
          console.error("Timed out waiting for SDK initialization");
          toast.error("Failed to initialize Pi Network SDK. Please refresh and try again.");
          throw new Error("Timed out waiting for SDK initialization");
        }
      }
    } catch (error) {
      console.error("Failed to initialize Pi Network SDK:", error);
      toast.error("Failed to initialize Pi Network. Please refresh and try again.");
      throw new Error("Failed to initialize Pi Network SDK");
    }

    // Validate the authenticate method
    if (!validateAuthenticateMethod()) {
      console.error("Pi Network SDK authentication method validation failed");
      toast.error("Pi Network SDK not properly loaded. Please refresh the page and try again.");
      throw new Error("Pi Network SDK not properly loaded. Please refresh the page and try again.");
    }

    // Additional SDK validation
    if (!validatePiSDK()) {
      console.error("Pi Network SDK validation failed before authentication");
      toast.error("Pi Network SDK not properly loaded. Please refresh the page and try again.");
      throw new Error("Pi Network SDK not properly loaded. Please refresh the page and try again.");
    }

    // Authenticate with Pi Network - ALWAYS include 'payments' scope
    console.log("Authenticating with Pi Network, requesting scopes: username, payments");
    toast.info("Authenticating with Pi Network...");
    
    const authResult = await window.Pi.authenticate(['username', 'payments'], (payment) => {
      console.log('Incomplete payment found:', payment);
      // Handle incomplete payment if needed
    });
    
    console.log("Authentication completed, result:", authResult ? "success" : "failed");
    
    if (authResult && authResult.user && authResult.accessToken) {
      console.log("Authentication successful, requesting additional permissions");
      
      // Get additional user permissions after authentication - ALWAYS include payments scope
      toast.info("Requesting additional permissions...");
      const additionalInfo = await requestUserPermissions();
      
      // Get user's subscription tier from Supabase
      console.log("Fetching subscription information...");
      const subscriptionTier = await getUserSubscription(authResult.user.uid);
      
      const userData: PiUser = {
        uid: authResult.user.uid,
        username: authResult.user.username,
        email: additionalInfo?.email,
        roles: authResult.user.roles,
        accessToken: authResult.accessToken,
        lastAuthenticated: Date.now(),
        subscriptionTier
      };

      console.log("Login successful, updating user data");
      
      // Update Supabase and localStorage
      await updateUserData(userData, setUser);
      
      toast.success(`Welcome back, ${userData.username}!`);
    } else {
      console.error("Authentication failed - no valid auth result");
      throw new Error("Authentication failed - no valid response from Pi Network");
    }
  } catch (error) {
    let errorMessage = "Authentication failed";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.error("Authentication error:", errorMessage);
    setAuthError(errorMessage);
    toast.error(errorMessage);
    console.error("Auth error:", error);
  } finally {
    setIsLoading(false);
  }
};

export const refreshUserData = async (
  user: PiUser | null,
  setUser: (user: PiUser) => void,
  setIsLoading: (loading: boolean) => void
): Promise<void> => {
  if (!user) return;

  try {
    setIsLoading(true);
    
    console.log("Refreshing user data");
    
    // Ensure SDK is initialized before proceeding
    try {
      await initializePiNetwork();
      
      if (!isSdkInitialized()) {
        try {
          await waitForSdkInitialization(5000);
        } catch (error) {
          console.error("Timed out waiting for SDK initialization during refresh:", error);
          return;
        }
      }
    } catch (error) {
      console.error("Failed to initialize Pi Network SDK during refresh:", error);
      return;
    }
    
    // Get user's current subscription
    const subscriptionTier = await getUserSubscription(user.uid);

    // Request additional permissions - explicitly include payments scope
    if (isPiNetworkAvailable()) {
      console.log("Refreshing user permissions, including payments scope");
      try {
        const additionalInfo = await requestUserPermissions();
        if (additionalInfo) {
          await updateUserData({
            ...user,
            email: additionalInfo.email || user.email,
            subscriptionTier
          }, setUser);
          toast.success("User profile updated");
        } else {
          console.log("Permission request returned null, updating subscription only");
          // Just update the subscription
          if (user.subscriptionTier !== subscriptionTier) {
            await updateUserData({
              ...user,
              subscriptionTier
            }, setUser);
          }
        }
      } catch (error) {
        console.error("Error refreshing user permissions:", error);
        toast.error("Failed to refresh user permissions. Please log in again.");
      }
    } else {
      console.log("Pi Network not available for permission refresh, updating subscription only");
      // Just update the subscription
      if (user.subscriptionTier !== subscriptionTier) {
        await updateUserData({
          ...user,
          subscriptionTier
        }, setUser);
      }
    }
  } catch (error) {
    console.error("Error refreshing user data:", error);
  } finally {
    setIsLoading(false);
  }
};

export const checkAccess = (
  user: PiUser | null,
  requiredTier: SubscriptionTier
): boolean => {
  if (!user) return false;
  
  const tierLevel = {
    [SubscriptionTier.INDIVIDUAL]: 0,
    [SubscriptionTier.SMALL_BUSINESS]: 1,
    [SubscriptionTier.ORGANIZATION]: 2,
  };

  const userLevel = tierLevel[user.subscriptionTier] || 0;
  const requiredLevel = tierLevel[requiredTier];

  return userLevel >= requiredLevel;
};
