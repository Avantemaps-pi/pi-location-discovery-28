
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable, isSdkInitialized, waitForSdkInitialization } from '@/utils/piNetwork';
import { PiUser, AuthContextType, STORAGE_KEY } from './types';
import { checkAccess } from './authUtils';
import { performLogin, refreshUserData as refreshUserDataService } from './authService';
import { useNetworkStatus } from './networkStatusService';
import { useSessionCheck } from './useSessionCheck';
import AuthContext from './useAuth';
import { SubscriptionTier } from '@/utils/piNetwork';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSdkInitializedState, setIsSdkInitializedState] = useState<boolean>(false);
  const pendingAuthRef = useRef<boolean>(false);
  const initAttempted = useRef<boolean>(false);
  const initTimeoutRef = useRef<number | null>(null);

  // Initialize Pi Network SDK
  useEffect(() => {
    // Only attempt initialization once
    if (initAttempted.current) return;
    
    initAttempted.current = true;
    const initSdk = async () => {
      try {
        console.log("Starting Pi Network SDK initialization...");
        const result = await initializePiNetwork();
        setIsSdkInitializedState(result);
        console.log("Pi Network SDK initialization complete:", result);
        
        if (result && pendingAuthRef.current) {
          console.log("SDK initialized and authentication was pending, attempting login now");
          pendingAuthRef.current = false;
          login();
        }
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK:", error);
        toast.error("Failed to initialize Pi Network SDK. Some features may be unavailable.");
        setIsSdkInitializedState(false);
      }
    };
    
    initSdk();
    
    // Clean up timeout on unmount
    return () => {
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  // Update SDK initialized state when the global state changes
  useEffect(() => {
    const checkSdkState = () => {
      const currentState = isSdkInitialized();
      if (currentState !== isSdkInitializedState) {
        console.log("SDK initialization state changed:", currentState);
        setIsSdkInitializedState(currentState);
      }
    };

    // Check immediately
    checkSdkState();

    // Set up an interval to periodically check if SDK is initialized
    const interval = setInterval(checkSdkState, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isSdkInitializedState]);

  // Helper function to ensure SDK is initialized
  const ensureSdkInitialized = useCallback(async (): Promise<boolean> => {
    if (isSdkInitializedState) {
      return true;
    }
    
    console.log("Ensuring SDK is initialized before proceeding...");
    
    if (!isPiNetworkAvailable()) {
      console.log("Pi Network SDK not available, attempting to load it");
      
      try {
        const result = await initializePiNetwork();
        setIsSdkInitializedState(result);
        return result;
      } catch (error) {
        console.error("Failed to load Pi Network SDK:", error);
        return false;
      }
    } else if (!isSdkInitialized()) {
      console.log("Pi Network is available but not initialized, initializing now");
      
      try {
        const result = await initializePiNetwork();
        setIsSdkInitializedState(result);
        
        if (!result) {
          return false;
        }
        
        try {
          // Wait up to 5 seconds for initialization
          await waitForSdkInitialization(5000);
          return true;
        } catch (error) {
          console.error("Timed out waiting for SDK initialization:", error);
          return false;
        }
      } catch (error) {
        console.error("Error initializing Pi Network SDK:", error);
        return false;
      }
    }
    
    return isSdkInitialized();
  }, [isSdkInitializedState]);

  // Login function - using useCallback to avoid infinite loops
  const login = useCallback(async (): Promise<void> => {
    console.log("Login attempt started");
    
    // Ensure SDK is initialized
    const sdkReady = await ensureSdkInitialized();
    
    if (!sdkReady) {
      console.log("SDK not ready, marking auth as pending");
      pendingAuthRef.current = true;
      toast.info("Preparing Pi Network authentication, please wait...");
      return;
    }
    
    await performLogin(
      true, // We've already ensured the SDK is initialized
      setIsLoading,
      setAuthError,
      (pending) => { pendingAuthRef.current = pending; },
      setUser
    );
  }, [ensureSdkInitialized]);

  // Handle online/offline status
  const isOffline = useNetworkStatus(pendingAuthRef, login);

  // Check for stored session on mount and validate it
  useSessionCheck(isSdkInitializedState, login, setUser, setIsLoading);

  // Refresh user data without full login
  const refreshUserData = useCallback(async (): Promise<void> => {
    const sdkReady = await ensureSdkInitialized();
    
    if (!sdkReady) {
      toast.error("Unable to refresh user data. Please try again later.");
      return;
    }
    
    await refreshUserDataService(user, setUser, setIsLoading);
  }, [user, ensureSdkInitialized]);

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
        isOffline: isOffline,
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
