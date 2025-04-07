
import { toast } from 'sonner';
import { PiUser } from './types';
import { 
  isPiNetworkAvailable, 
  initializePiNetwork,
  SubscriptionTier,
  requestUserPermissions
} from '@/utils/piNetwork';
import { getUserSubscription, updateUserData } from './authUtils';

export const performLogin = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  setPendingAuth: (pending: boolean) => void,
  setUser: (user: PiUser | null) => void,
  setAccessToken: (token: string | null) => void
): Promise<void> => {
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
      throw new Error("Pi Network SDK is not available");
    }

    // Ensure SDK is initialized before authentication
    try {
      await initializePiNetwork();
    } catch (error) {
      throw new Error("Failed to initialize Pi Network SDK");
    }

    // Authenticate with Pi Network with required scopes
    console.log("Authenticating with Pi Network, requesting scopes: username, payments, wallet_address");
    const authResult = await window.Pi!.authenticate(['username', 'payments', 'wallet_address'], (payment) => {
      console.log('Incomplete payment found:', payment);
      // Handle incomplete payment when needed
      // This would involve sending the payment to your server for completion
    });
    
    if (authResult && authResult.user && authResult.accessToken) {
      console.log("Authentication successful");
      
      // Get user's subscription tier from Supabase
      const subscriptionTier = await getUserSubscription(authResult.user.uid);
      
      // Extract wallet address if available from user properties
      // Note: In real implementation, use your backend with Platform API to verify this
      const walletAddress = (authResult as any).user.wallet_address;
      
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
      
      // Set the access token
      setAccessToken(authResult.accessToken);
      
      toast.success(`Welcome back, ${userData.username}!`);
    } else {
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
