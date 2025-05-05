
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { initializePiNetwork } from '@/utils/piNetwork';
import { PiUser, AuthContextType, STORAGE_KEY } from './types';
import { checkAccess } from './authUtils';
import { performLogin, refreshUserData as refreshUserDataService, requestAuthPermissions } from './authService';
import { useNetworkStatus } from './networkStatusService';
import { SubscriptionTier } from '@/utils/piNetwork/types';
import AuthContext from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start with loading true
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState<boolean>(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const pendingAuthRef = useRef<boolean>(false);
  const initAttempted = useRef<boolean>(false);
  const authTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Minimum time between refresh calls (15 minutes)
  const REFRESH_COOLDOWN = 15 * 60 * 1000; 
  // Maximum time to wait for authentication before timing out (30 seconds)
  const AUTH_TIMEOUT = 30 * 1000;

  // Check for cached session on mount
  useEffect(() => {
    const cachedSession = localStorage.getItem(STORAGE_KEY);
    
    if (cachedSession) {
      try {
        const userData = JSON.parse(cachedSession) as PiUser;
        // Check if the session is still relatively fresh (less than 24 hours old)
        if (Date.now() - userData.lastAuthenticated < 24 * 60 * 60 * 1000) {
          console.log("Restoring user from cached session");
          setUser(userData);
        } else {
          console.log("Cached session expired");
        }
      } catch (error) {
        console.error("Error parsing cached session:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    
    // Set a timeout to automatically set isLoading to false after AUTH_TIMEOUT
    // This prevents the app from being stuck in the loading state indefinitely
    authTimeoutRef.current = setTimeout(() => {
      if (isLoading) {
        console.log("Authentication timed out, resetting loading state");
        setIsLoading(false);
        setAuthError("Authentication timed out. Please try again later.");
      }
    }, AUTH_TIMEOUT);
    
    setIsLoading(false); // Reset loading state since we've checked cache
    
    return () => {
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
    };
  }, []);

  // Initialize Pi Network SDK but don't authenticate automatically
  useEffect(() => {
    if (initAttempted.current) return;
    
    initAttempted.current = true;
    const initSdk = async () => {
      try {
        console.log("Starting Pi Network SDK initialization...");
        const result = await initializePiNetwork();
        setIsSdkInitialized(result);
        console.log("Pi Network SDK initialization complete:", result);
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK:", error);
        toast.error("Failed to initialize Pi Network SDK. Some features may be unavailable.");
        setIsSdkInitialized(false);
      }
    };
    
    initSdk();
  }, []);

  // Two-step login process
  const login = useCallback(async (): Promise<void> => {
    if (!isSdkInitialized) {
      try {
        console.log("Attempting to initialize SDK before login...");
        const result = await initializePiNetwork();
        setIsSdkInitialized(result);
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK during login:", error);
        toast.error("Failed to initialize Pi Network SDK. Please try again later.");
        return;
      }
    }
    
    setIsLoading(true);
    
    // Set authentication timeout
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
    }
    
    authTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setAuthError("Authentication timed out. Please try again.");
      toast.error("Authentication timed out. Please try again.");
    }, AUTH_TIMEOUT);
    
    // First step: Request permissions
    const permissionsGranted = await requestAuthPermissions(
      isSdkInitialized, 
      setIsLoading, 
      setAuthError
    );
    
    if (!permissionsGranted) {
      console.log("Permissions not granted. Authentication aborted.");
      setIsLoading(false);
      if (authTimeoutRef.current) {
        clearTimeout(authTimeoutRef.current);
      }
      return;
    }
    
    // Second step: Authenticate with Pi Network
    await performLogin(
      isSdkInitialized,
      setIsLoading,
      setAuthError,
      (pending) => { pendingAuthRef.current = pending; },
      setUser
    );
    
    // Clear authentication timeout
    if (authTimeoutRef.current) {
      clearTimeout(authTimeoutRef.current);
      authTimeoutRef.current = null;
    }
    
    // Update last refresh timestamp
    setLastRefresh(Date.now());
  }, [isSdkInitialized]);

  // Handle online/offline status
  const isOffline = useNetworkStatus(pendingAuthRef, login);

  // Refresh user data without full login
  const refreshUserData = useCallback(async (force: boolean = false): Promise<void> => {
    // Skip refresh if called too frequently unless forced
    const now = Date.now();
    if (!force && now - lastRefresh < REFRESH_COOLDOWN) {
      console.log("Skipping refresh, too soon since last refresh");
      return;
    }
    
    if (!isSdkInitialized) {
      try {
        const result = await initializePiNetwork();
        setIsSdkInitialized(result);
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK during refresh:", error);
        return;
      }
    }
    
    if (!user) {
      console.log("No user to refresh data for");
      return;
    }
    
    console.log("Refreshing user data...");
    setIsLoading(true);
    try {
      await refreshUserDataService(user, setUser, setIsLoading);
      console.log("User data refreshed successfully");
      setLastRefresh(now);
    } catch (error) {
      console.error("Failed to refresh user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isSdkInitialized, lastRefresh]);
  
  // Silent refresh when app starts or becomes online
  useEffect(() => {
    if (user && !isOffline && isSdkInitialized) {
      // Use setTimeout to avoid refreshing immediately during initial render
      const timer = setTimeout(() => {
        refreshUserData(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [user, isOffline, isSdkInitialized, refreshUserData]);

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.info("You've been logged out");
  };

  // Check if user has access to a feature based on their subscription
  const hasAccess = useCallback((requiredTier: SubscriptionTier): boolean => {
    if (!user) return false;
    return checkAccess(user.subscriptionTier, requiredTier);
  }, [user]);

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
        refreshUserData: () => refreshUserData(true)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
