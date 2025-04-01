
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  isPiNetworkAvailable, 
  requestUserPermissions, 
  SubscriptionTier
} from '@/utils/piNetworkUtils';
import { supabase } from '@/integrations/supabase/client';

// Define the user type
export interface PiUser {
  uid: string;
  username: string;
  email?: string;
  roles?: string[];
  accessToken: string;
  lastAuthenticated: number;
  subscriptionTier: SubscriptionTier;
}

interface AuthContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOffline: boolean;
  login: () => Promise<void>;
  logout: () => void;
  authError: string | null;
  hasAccess: (requiredTier: SubscriptionTier) => boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const STORAGE_KEY = 'avante_maps_auth';

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

  // Update user data in Supabase and local storage
  const updateUserData = async (userData: PiUser) => {
    try {
      // Save to Supabase if we have a valid connection
      const { error } = await supabase
        .from('users')
        .upsert({
          uid: userData.uid,
          username: userData.username,
          email: userData.email,
          subscription_tier: userData.subscriptionTier,
          last_login: new Date().toISOString()
        }, {
          onConflict: 'uid'
        });

      if (error) {
        console.error("Error updating user in Supabase:", error);
      }

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      setUser(userData);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  // Get user's subscription from Supabase
  const getUserSubscription = async (uid: string): Promise<SubscriptionTier> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('subscription_tier')
        .eq('uid', uid)
        .single();

      if (error || !data) {
        console.error("Error fetching subscription:", error);
        return SubscriptionTier.INDIVIDUAL; // Default to INDIVIDUAL if error
      }

      return data.subscription_tier as SubscriptionTier || SubscriptionTier.INDIVIDUAL;
    } catch (error) {
      console.error("Error in getUserSubscription:", error);
      return SubscriptionTier.INDIVIDUAL;
    }
  };

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
          });
          toast.success("User profile updated");
        }
      } else {
        // Just update the subscription
        if (user.subscriptionTier !== subscriptionTier) {
          await updateUserData({
            ...user,
            subscriptionTier
          });
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
        await updateUserData(userData);
        
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
    
    const tierLevel = {
      [SubscriptionTier.INDIVIDUAL]: 0,
      [SubscriptionTier.SMALL_BUSINESS]: 1,
      [SubscriptionTier.ORGANIZATION]: 2,
    };

    const userLevel = tierLevel[user.subscriptionTier] || 0;
    const requiredLevel = tierLevel[requiredTier];

    return userLevel >= requiredLevel;
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
