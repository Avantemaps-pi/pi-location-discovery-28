
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { initializePiNetwork, isSdkInitialized } from '@/utils/piNetwork';
import { PiUser, AuthContextType, STORAGE_KEY } from './types';
import { checkAccess } from './authUtils';
import { performLogin, refreshUserData as refreshUserDataService, requestAuthPermissions } from './authService';
import { useNetworkStatus } from './networkStatusService';
import { SubscriptionTier } from '@/utils/piNetwork/types';
import AuthContext from './useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState<boolean>(false);
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const [sessionRestorationComplete, setSessionRestorationComplete] = useState<boolean>(false);
  const pendingAuthRef = useRef<boolean>(false);
  const initAttempted = useRef<boolean>(false);
  
  // Longer refresh cooldown to reduce unnecessary API calls
  const REFRESH_COOLDOWN = 30 * 60 * 1000; // 30 minutes
  
  // Performance tracking
  const mountTime = useRef(performance.now());

  // Check for cached session on mount - Do this first for best UX
  useEffect(() => {
    console.log("🔍 Checking for cached session");
    const sessionCheckStart = performance.now();
    const cachedSession = localStorage.getItem(STORAGE_KEY);
    
    if (cachedSession) {
      try {
        const userData = JSON.parse(cachedSession) as PiUser;
        // Check if the session is still relatively fresh (less than 24 hours old)
        if (Date.now() - userData.lastAuthenticated < 24 * 60 * 60 * 1000) {
          console.log(`📦 Restored user from cached session in ${Math.round(performance.now() - sessionCheckStart)}ms`);
          setUser(userData);
        } else {
          console.log("🕒 Cached session expired");
        }
      } catch (error) {
        console.error("❌ Error parsing cached session:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      console.log("🔍 No cached session found");
    }
    
    setSessionRestorationComplete(true);
  }, []);

  // Initialize Pi Network SDK lazily - only when needed
  useEffect(() => {
    if (initAttempted.current) return;
    
    // Delay SDK initialization slightly to prioritize UI rendering
    const timer = setTimeout(() => {
      initAttempted.current = true;
      const initSdk = async () => {
        try {
          console.log("🔄 Starting Pi Network SDK initialization...");
          const initStart = performance.now();
          const result = await initializePiNetwork();
          setIsSdkInitialized(result);
          console.log(`✅ Pi Network SDK initialization complete: ${result} (${Math.round(performance.now() - initStart)}ms)`);
        } catch (error) {
          console.error("❌ Failed to initialize Pi Network SDK:", error);
          toast.error("Failed to initialize Pi Network SDK. Some features may be unavailable.");
          setIsSdkInitialized(false);
        }
      };
      
      initSdk();
    }, 500); // Short delay to prioritize UI rendering
    
    return () => clearTimeout(timer);
  }, []);

  // Login function with performance monitoring
  const login = useCallback(async (): Promise<void> => {
    // Render load indicators immediately for better UX
    setIsLoading(true);
    toast.loading("Connecting to Pi Network...", { id: "login-process" });
    
    // Ensure SDK is initialized
    if (!isSdkInitialized && !isSdkInitialized()) {
      try {
        console.log("🔄 Attempting to initialize SDK before login...");
        const initStart = performance.now();
        const result = await initializePiNetwork();
        setIsSdkInitialized(result);
        console.log(`✅ SDK initialized during login in ${Math.round(performance.now() - initStart)}ms`);
      } catch (error) {
        console.error("❌ Failed to initialize Pi Network SDK during login:", error);
        toast.error("Failed to initialize Pi Network SDK. Please try again later.");
        setIsLoading(false);
        toast.dismiss("login-process");
        return;
      }
    }
    
    // First step: Request permissions
    const permissionsGranted = await requestAuthPermissions(
      isSdkInitialized, 
      setIsLoading, 
      setAuthError
    );
    
    if (!permissionsGranted) {
      console.log("⚠️ Permissions not granted. Authentication aborted.");
      setIsLoading(false);
      toast.dismiss("login-process");
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
    
    // Update last refresh timestamp
    setLastRefresh(Date.now());
    toast.dismiss("login-process");
  }, [isSdkInitialized]);

  // Handle online/offline status
  const isOffline = useNetworkStatus(pendingAuthRef, login);

  // Refresh user data without full login
  const refreshUserData = useCallback(async (force: boolean = false): Promise<void> => {
    // Skip refresh if called too frequently unless forced
    const now = Date.now();
    if (!force && now - lastRefresh < REFRESH_COOLDOWN) {
      console.log("⏱️ Skipping refresh, too soon since last refresh");
      return;
    }
    
    // Only proceed if there's a user to refresh
    if (!user) {
      console.log("ℹ️ No user to refresh data for");
      return;
    }
    
    console.log("🔄 Refreshing user data...");
    setIsLoading(true);
    try {
      await refreshUserDataService(user, setUser, setIsLoading);
      console.log("✅ User data refreshed successfully");
      setLastRefresh(now);
    } catch (error) {
      console.error("❌ Failed to refresh user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user, lastRefresh]);
  
  // Silent refresh when app starts or becomes online - but only after a delay
  useEffect(() => {
    if (user && !isOffline && isSdkInitialized && sessionRestorationComplete) {
      // Use setTimeout to avoid refreshing immediately during initial render
      const timer = setTimeout(() => {
        console.log("🔄 Performing background refresh of user data");
        refreshUserData(false);
      }, 2000); // Longer delay for better UX
      
      return () => clearTimeout(timer);
    }
  }, [user, isOffline, isSdkInitialized, sessionRestorationComplete, refreshUserData]);
  
  // Log total initialization time
  useEffect(() => {
    if (sessionRestorationComplete && (isSdkInitialized || isSdkInitialized())) {
      const totalInitTime = performance.now() - mountTime.current;
      console.log(`📊 Auth provider fully initialized in ${Math.round(totalInitTime)}ms`);
    }
  }, [sessionRestorationComplete, isSdkInitialized]);

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
