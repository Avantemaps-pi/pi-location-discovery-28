
import { isPiNetworkAvailable, isRunningInPiBrowser } from '@/utils/piNetwork';
import { PiUser, STORAGE_KEY } from './types';
import { getUserSubscription, updateUserData } from './authUtils';

// Attempt to perform a login with Pi Network
export const performLogin = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  setPendingAuth: (pending: boolean) => void,
  setUser: (user: PiUser | null) => void
): Promise<boolean> => {
  if (!isPiNetworkAvailable() || !isSdkInitialized) {
    console.error("Pi Network SDK not available or not initialized");
    setAuthError("Pi Network SDK is not available. Please use Pi Browser.");
    setIsLoading(false);
    return false;
  }

  try {
    // Set loading state
    setIsLoading(true);
    setPendingAuth(true);
    setAuthError(null);
    
    // Request all required scopes
    console.log("Authenticating with Pi Network, requesting scopes: username, payments, wallet_address");
    const authResult = await window.Pi.authenticate(
      ["username", "payments", "wallet_address"], 
      // Optional onIncompletePaymentFound callback
      (payment) => {
        console.log("Incomplete payment found:", payment);
      }
    );

    // Store access token in localStorage (this is a temporary solution for the demo)
    localStorage.setItem('pi_access_token', authResult.accessToken);

    // Check if we're in Pi Browser (for additional security checks in a production app)
    const inPiBrowser = isRunningInPiBrowser();
    
    // Construct user object
    const userData: PiUser = {
      uid: authResult.user.uid,
      username: authResult.user.username,
      walletAddress: authResult.user.walletAddress,
      inPiBrowser,
      // Default to individual tier - will be updated from database if available
      subscriptionTier: 'individual',
      lastLogin: new Date().toISOString(),
    };

    // Get user's subscription from database if it exists
    try {
      const subscriptionTier = await getUserSubscription(userData.uid);
      userData.subscriptionTier = subscriptionTier;
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Continue with default individual tier
    }

    // Update user data in database and state
    await updateUserData(userData, setUser);
    
    // Clear any previous errors
    setAuthError(null);
    setPendingAuth(false);
    setIsLoading(false);
    
    return true;
  } catch (error) {
    console.error("Authentication error:", error);
    let errorMessage = "Failed to authenticate";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    setAuthError(errorMessage);
    setPendingAuth(false);
    setIsLoading(false);
    
    return false;
  }
};

// Refresh user data (lighter-weight than full login)
export const refreshUserData = async (
  currentUser: PiUser | null,
  setUser: (user: PiUser | null) => void,
  setIsLoading: (loading: boolean) => void
): Promise<boolean> => {
  if (!currentUser) {
    console.log("No user to refresh");
    return false;
  }
  
  if (!isPiNetworkAvailable()) {
    console.log("Pi Network SDK not available, cannot refresh user data");
    return false;
  }
  
  try {
    setIsLoading(true);
    
    // Get fresh subscription data
    const subscriptionTier = await getUserSubscription(currentUser.uid);
    
    // Update our local user data
    const updatedUser: PiUser = {
      ...currentUser,
      subscriptionTier,
      lastRefresh: new Date().toISOString()
    };
    
    // Update in database and state
    await updateUserData(updatedUser, setUser);
    
    setIsLoading(false);
    return true;
  } catch (error) {
    console.error("Error refreshing user data:", error);
    setIsLoading(false);
    return false;
  }
};
