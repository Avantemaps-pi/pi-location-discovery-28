
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define the Pi Network SDK types
declare global {
  interface Window {
    Pi?: {
      authenticate: (
        scopes: string[], 
        onIncompletePaymentFound?: (payment: any) => void
      ) => Promise<{
        accessToken: string;
        user: {
          uid: string;
          username: string;
          roles?: string[];
        };
      }>;
    };
  }
}

// Define the user type
export interface PiUser {
  uid: string;
  username: string;
  roles?: string[];
  accessToken: string;
  lastAuthenticated: number;
}

interface AuthContextType {
  user: PiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isOffline: boolean;
  login: () => Promise<void>;
  logout: () => void;
  authError: string | null;
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
      if (!window.Pi) {
        throw new Error("Pi Network SDK is not available");
      }

      // Authenticate with Pi Network
      const authResult = await window.Pi.authenticate(['username'], () => {});
      
      if (authResult && authResult.user && authResult.accessToken) {
        const userData: PiUser = {
          uid: authResult.user.uid,
          username: authResult.user.username,
          roles: authResult.user.roles,
          accessToken: authResult.accessToken,
          lastAuthenticated: Date.now()
        };

        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        setUser(userData);
        
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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        isOffline,
        login,
        logout,
        authError
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
