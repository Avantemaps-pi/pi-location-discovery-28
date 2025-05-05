import { toast } from 'sonner';
import { PiUser } from './types';
import { 
  isPiNetworkAvailable, 
  initializePiNetwork,
  requestUserPermissions
} from '@/utils/piNetwork';
import { SubscriptionTier } from '@/utils/piNetwork/types';
import { getUserSubscription, updateUserData } from './authUtils';

// Request permissions before authenticating
export const requestAuthPermissions = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void
): Promise<boolean> => {
  if (!isSdkInitialized) {
    console.log("SDK not initialized during permission request");
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
      console.error("Pi Network SDK is not available");
      throw new Error("Pi Network SDK is not available");
    }

    // Ensure SDK is initialized before requesting permissions
    try {
      const initResult = await initializePiNetwork();
      if (!initResult) {
        throw new Error("Failed to initialize Pi Network SDK");
      }
    } catch (error) {
      console.error("SDK init error:", error);
      throw new Error("Failed to initialize Pi Network SDK");
    }

    // Request permissions with Pi Network
    const userInfo = await requestUserPermissions();
    
    if (userInfo) {
      console.log("Permission request successful:", userInfo);
      toast.success("Permissions granted. Proceeding with authentication.");
      return true;
    } else {
      console.log("Permission request failed or was denied");
      throw new Error("Permission request failed or was denied");
    }
  } catch (error) {
    let errorMessage = "Permission request failed";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    console.error("Permission error:", errorMessage);
    setAuthError(errorMessage);
    toast.error(errorMessage);
    return false;
  } finally {
    setIsLoading(false);
  }
};

export const performLogin = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  setPendingAuth: (pending: boolean) => void,
  setUser: (user: PiUser | null) => void
): Promise<void> => {
  // Don't attempt login if SDK is not initialized yet
  if (!isSdkInitialized) {
    setPendingAuth(true);
    console.log("SDK not initialized during login attempt");
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
      throw new Error("Pi Network SDK is not available");
    }

    // Ensure SDK is initialized before authentication
    try {
      const initResult = await initializePiNetwork();
      if (!initResult) {
        throw new Error("Failed to initialize Pi Network SDK");
      }
    } catch (error) {
      console.error("SDK init error during login:", error);
      throw new Error("Failed to initialize Pi Network SDK");
    }

    // Authenticate with Pi Network with required scopes
    console.log("Authenticating with Pi Network, requesting scopes: username, payments, wallet_address");
    const authResult = await window.Pi!.authenticate(['username', 'payments', 'wallet_address'], (payment) => {
      console.log('Incomplete payment found:', payment);
      // Handle incomplete payment when needed
      // This would involve sending the payment to your server for completion
    });
    
    console.log("Authentication result:", authResult);
    
    if (authResult && authResult.user && authResult.accessToken) {
      console.log("Authentication successful");
      
      // Store the current user in the window.Pi object for later use
      if (window.Pi) {
        window.Pi.currentUser = {
          uid: authResult.user.uid,
          username: authResult.user.username,
          roles: authResult.user.roles
        };
      }
      
      // Get user's subscription tier from Supabase
      const subscriptionTier = await getUserSubscription(authResult.user.uid);
      
      // Extract wallet address if available from user properties
      // Type assertion to access wallet_address property
      const authResultWithWallet = authResult as {
        user: {
          uid: string;
          username: string;
          roles?: string[];
          wallet_address?: string;
        };
        accessToken: string;
      };
      
      const walletAddress = authResultWithWallet.user.wallet_address;
      
      const userData: PiUser = {
        uid: authResult.user.uid,
        username: authResult.user.username,
        walletAddress: walletAddress, 
        roles: authResult.user.roles,
        accessToken: authResult.accessToken,
        lastAuthenticated: Date.now(),
        subscriptionTier
      };

      // Update Supabase and localStorage
      await updateUserData(userData, setUser);
      
      toast.success(`Welcome back, ${userData.username}!`);
    } else {
      console.error("Authentication failed: auth result incomplete", authResult);
      throw new Error("Authentication failed");
    }
  } catch (error) {
    let errorMessage = "Authentication failed";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    setAuthError(errorMessage);
    toast.error(errorMessage);
    console.error("Auth error:", error);
  } finally {
    setPendingAuth(false);
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
    
    // Ensure SDK is initialized before proceeding
    try {
      await initializePiNetwork();
    } catch (error) {
      console.error("Failed to initialize Pi Network SDK:", error);
      return;
    }
    
    // Get user's current subscription
    const subscriptionTier = await getUserSubscription(user.uid);

    // Request permissions again to ensure all required ones are granted
    if (isPiNetworkAvailable()) {
      console.log("Refreshing user permissions with authenticate");
      const authResult = await window.Pi!.authenticate(['username', 'payments', 'wallet_address'], (payment) => {
        console.log('Incomplete payment found during refresh:', payment);
      });
      
      if (authResult) {
        // Update the current user in the window.Pi object
        if (window.Pi) {
          window.Pi.currentUser = {
            uid: authResult.user.uid,
            username: authResult.user.username,
            roles: authResult.user.roles
          };
        }
        
        // Extract wallet address if available
        const walletAddress = (authResult as any).user.wallet_address;
        
        await updateUserData({
          ...user,
          walletAddress: walletAddress || user.walletAddress,
          subscriptionTier
        }, setUser);
        toast.success("User profile updated");
      }
    } else {
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
    toast.error("Failed to refresh user data. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
