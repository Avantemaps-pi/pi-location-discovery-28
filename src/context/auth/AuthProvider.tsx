
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  isPiNetworkAvailable, 
  requestUserPermissions
} from '@/utils/piNetworkUtils';
import { PiUser, AuthContextType, SESSION_TIMEOUT, STORAGE_KEY } from './types';
import { updateUserData, getUserSubscription, checkAccess } from './authUtils';

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [authError, setAuthError] = useState<string | null>(null);
  const [pendingAuth, setPendingAuth] = useState<boolean>(false);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success("You're back online!");
      
      // If there was a pending authentication, retry it
      if (pendingAuth) {
        login();
        setPendingAuth(false);
      }
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.warning("You're currently offline. Some features may be unavailable.");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [pendingAuth]);

  // Check for stored session on mount and validate it
  useEffect(() => {
    const checkSession = async () => {
      try {
        const storedSession = localStorage.getItem(STORAGE_KEY);
        
        if (storedSession) {
          const sessionData = JSON.parse(storedSession) as PiUser;
          const currentTime = Date.now();
          
          // Check if session is still valid (within 24 hours)
          if (currentTime - sessionData.lastAuthenticated < SESSION_TIMEOUT) {
            setUser(sessionData);
          } else {
            // Session expired, try to re-authenticate
            await login();
          }
        } else if (navigator.onLine) {
          // No stored session but online, try auto-login
          await login();
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Refresh user data without full login
  const refreshUserData = async (): Promise<void> => {
    if (!user) return;

    try {
      setIsLoading(true);
      // Get user's current subscription
      const subscriptionTier = await getUserSubscription(user.uid);

      // Request additional permissions if email is not already available
      if (!user.email && isPiNetworkAvailable()) {
        const additionalInfo = await requestUserPermissions();
        if (additionalInfo && additionalInfo.email) {
          await updateUserData({
            ...user,
            email: additionalInfo.email,
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
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (): Promise<void> => {
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

      // Authenticate with Pi Network
      const authResult = await window.Pi.authenticate(['username'], () => {});
      
      if (authResult && authResult.user && authResult.accessToken) {
        // Get additional user permissions after authentication
        const additionalInfo = await requestUserPermissions();
        
        // Get user's subscription tier from Supabase
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

        // Update Supabase and localStorage
        await updateUserData(userData, setUser);
        
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

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.info("You've been logged out");
  };

  // Check if user has access to a feature based on their subscription
  const hasAccess = (requiredTier: SubscriptionTier): boolean => {
    if (!user) return false;
    return checkAccess(user.subscriptionTier, requiredTier);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isOffline,
        login,
        logout,
        authError,
        hasAccess,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
