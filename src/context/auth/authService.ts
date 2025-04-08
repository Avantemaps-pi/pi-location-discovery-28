
import { toast } from 'sonner';
import { PiUser, SESSION_TIMEOUT } from './types';
import { 
  isPiNetworkAvailable, 
  initializePiNetwork,
  SubscriptionTier,
  requestUserPermissions
} from '@/utils/piNetwork';
import { getUserSubscription, updateUserData } from './authUtils';

// Track last authentication timestamp to prevent too frequent calls
let lastAuthAttempt = 0;
const AUTH_THROTTLE_MS = 10000; // 10 seconds between auth attempts

export const performLogin = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  setPendingAuth: (pending: boolean) => void,
  setUser: (user: PiUser | null) => void,
  setAccessToken: (token: string | null) => void
): Promise<void> => {
  // Throttle authentication attempts
  const now = Date.now();
  if (now - lastAuthAttempt < AUTH_THROTTLE_MS) {
    console.log('Throttling auth attempt, last attempt was', (now - lastAuthAttempt)/1000, 'seconds ago');
    return;
  }
  
  lastAuthAttempt = now;
  
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
    });
    
    if (authResult && authResult.user && authResult.accessToken) {
      console.log("Authentication successful");
      console.log("Auth result:", authResult);
      
      // Get user's subscription tier from Supabase
      const subscriptionTier = await getUserSubscription(authResult.user.uid);
      
      // Access wallet address directly from the auth result
      // This is how the Pi SDK returns wallet_address in the response
      const walletAddress = (authResult as any).user.wallet_address;
      console.log("Wallet address from auth:", walletAddress);
      
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

// Track last refresh timestamp to prevent too frequent calls
let lastRefreshAttempt = 0;
const REFRESH_THROTTLE_MS = 60000; // 60 seconds between refresh attempts

export const refreshUserData = async (
  user: PiUser | null,
  setUser: (user: PiUser) => void,
  setIsLoading: (loading: boolean) => void
): Promise<void> => {
  if (!user) return;

  // Throttle refresh attempts
  const now = Date.now();
  if (now - lastRefreshAttempt < REFRESH_THROTTLE_MS) {
    console.log('Throttling refresh attempt, last attempt was', (now - lastRefreshAttempt)/1000, 'seconds ago');
    return;
  }
  
  lastRefreshAttempt = now;
  
  // Check if session is still valid
  const sessionAge = now - user.lastAuthenticated;
  if (sessionAge > SESSION_TIMEOUT) {
    console.log('Session expired during refresh, session age:', sessionAge/1000/60, 'minutes');
    return; // Let the session timeout handler deal with this
  }
  
  // Skip refresh if session is very new (less than 5 minutes)
  if (sessionAge < 300000) { // 5 minutes
    console.log('Session is fresh (less than 5 minutes old), skipping unnecessary refresh');
    return;
  }

  try {
    setIsLoading(true);
    console.log('Refreshing user data for', user.username);
    
    // Get user's current subscription without triggering auth
    const subscriptionTier = await getUserSubscription(user.uid);
    
    // Only update the user if subscription has changed to avoid triggering re-renders
    if (user.subscriptionTier !== subscriptionTier) {
      console.log('Subscription changed from', user.subscriptionTier, 'to', subscriptionTier);
      await updateUserData({
        ...user,
        subscriptionTier,
        lastAuthenticated: user.lastAuthenticated // preserve original timestamp
      }, setUser);
    } else {
      console.log('No subscription changes detected');
    }
  } catch (error) {
    console.error("Error refreshing user data:", error);
    // Don't show error toast for refresh failures to avoid user confusion
  } finally {
    setIsLoading(false);
  }
};
