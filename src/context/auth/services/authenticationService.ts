
import { toast } from 'sonner';
import { PiUser } from '../types';
import { 
  isPiNetworkAvailable, 
  initializePiNetwork,
  isSdkInitialized
} from '@/utils/piNetwork';
import { getUserSubscription, updateUserData } from '../authUtils';

// Cache for recently retrieved subscription data to prevent redundant queries
const subscriptionCache = new Map<string, { tier: string, timestamp: number }>();
const SUBSCRIPTION_CACHE_TTL = 60000; // 1 minute cache TTL

/**
 * Perform login with Pi Network with performance optimizations
 */
export const performLogin = async (
  isSdkInitialized: boolean,
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: string | null) => void,
  setPendingAuth: (pending: boolean) => void,
  setUser: (user: PiUser | null) => void
): Promise<void> => {
  // Performance tracking
  const startTime = performance.now();
  console.log("🕒 Login process started");
  
  // Don't attempt login if SDK is not initialized yet
  if (!isSdkInitialized) {
    setPendingAuth(true);
    setIsLoading(true);
    
    try {
      // Attempt to initialize SDK with minimal retry
      console.log("🔄 Initializing Pi SDK during login...");
      const initialized = await initializePiNetwork();
      if (!initialized) {
        throw new Error("SDK initialization failed");
      }
    } catch (error) {
      console.error("❌ Login aborted: SDK initialization failed");
      toast.warning("Pi Network connection failed. Please retry in a moment.");
      setIsLoading(false);
      return;
    }
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

    // Authentication is the most time-consuming step, so provide clear feedback
    console.log("🔑 Authenticating with Pi Network, requesting scopes");
    toast.info("Connecting to Pi Network...", { id: "pi-auth-progress" });
    
    // Authenticate with Pi Network with required scopes
    const authResult = await window.Pi!.authenticate(['username', 'payments', 'wallet_address'], (payment) => {
      console.log('Incomplete payment found:', payment);
    });
    
    const authTime = performance.now() - startTime;
    console.log(`✅ Authentication completed in ${Math.round(authTime)}ms`);
    toast.dismiss("pi-auth-progress");
    
    if (authResult && authResult.user && authResult.accessToken) {
      toast.success("Authentication successful!", { id: "auth-success" });
      
      // Store the current user in the window.Pi object for later use
      if (window.Pi) {
        window.Pi.currentUser = {
          uid: authResult.user.uid,
          username: authResult.user.username,
          roles: authResult.user.roles
        };
      }
      
      // Check subscription cache first to avoid database call
      let subscriptionTier;
      const cachedSubscription = subscriptionCache.get(authResult.user.uid);
      
      if (cachedSubscription && (Date.now() - cachedSubscription.timestamp < SUBSCRIPTION_CACHE_TTL)) {
        subscriptionTier = cachedSubscription.tier;
        console.log("📦 Using cached subscription data");
      } else {
        // Get user's subscription tier from Supabase
        console.log("📡 Fetching subscription data");
        const subStartTime = performance.now();
        subscriptionTier = await getUserSubscription(authResult.user.uid);
        console.log(`🔄 Subscription data retrieved in ${Math.round(performance.now() - subStartTime)}ms`);
        
        // Update cache
        subscriptionCache.set(authResult.user.uid, {
          tier: subscriptionTier,
          timestamp: Date.now()
        });
      }
      
      // Extract wallet address if available from user properties
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
      const updateStartTime = performance.now();
      await updateUserData(userData, setUser);
      console.log(`🔄 User data updated in ${Math.round(performance.now() - updateStartTime)}ms`);
      
      const totalTime = performance.now() - startTime;
      console.log(`✅ Total login process completed in ${Math.round(totalTime)}ms`);
      toast.success(`Welcome back, ${userData.username}!`, {
        id: "login-complete",
        duration: 3000,
      });
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

/**
 * Refresh user data with performance optimizations
 */
export const refreshUserData = async (
  user: PiUser | null,
  setUser: (user: PiUser) => void,
  setIsLoading: (loading: boolean) => void
): Promise<void> => {
  if (!user) return;

  const startTime = performance.now();
  console.log("🔄 Starting user data refresh");
  
  try {
    setIsLoading(true);
    
    // Check subscription cache first
    const cachedSubscription = subscriptionCache.get(user.uid);
    let subscriptionTier;
    
    if (cachedSubscription && (Date.now() - cachedSubscription.timestamp < SUBSCRIPTION_CACHE_TTL)) {
      subscriptionTier = cachedSubscription.tier;
      console.log("📦 Using cached subscription data for refresh");
    } else {
      // Get user's current subscription
      const subStartTime = performance.now();
      subscriptionTier = await getUserSubscription(user.uid);
      console.log(`🔄 Subscription data retrieved in ${Math.round(performance.now() - subStartTime)}ms`);
      
      // Update cache
      subscriptionCache.set(user.uid, {
        tier: subscriptionTier,
        timestamp: Date.now()
      });
    }

    // Only perform Pi Network operations if SDK is already initialized
    // This prevents unnecessary SDK initialization during refresh
    if (isSdkInitialized() && isPiNetworkAvailable()) {
      console.log("🔑 Refreshing user permissions with authenticate");
      const authStartTime = performance.now();
      const authResult = await window.Pi!.authenticate(['username', 'payments', 'wallet_address'], (payment) => {
        console.log('Incomplete payment found during refresh:', payment);
      });
      console.log(`🔄 Authentication refresh completed in ${Math.round(performance.now() - authStartTime)}ms`);
      
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
        
        const updateStartTime = performance.now();
        await updateUserData({
          ...user,
          walletAddress: walletAddress || user.walletAddress,
          subscriptionTier
        }, setUser);
        console.log(`🔄 User data updated in ${Math.round(performance.now() - updateStartTime)}ms`);
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
    
    const totalTime = performance.now() - startTime;
    console.log(`✅ User data refresh completed in ${Math.round(totalTime)}ms`);
  } catch (error) {
    console.error("Error refreshing user data:", error);
    toast.error("Failed to refresh user data. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
