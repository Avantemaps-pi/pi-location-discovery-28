
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { initializePiNetwork, isPiNetworkAvailable, isSdkInitialized } from '@/utils/piNetwork';
import { PiUser, AuthContextType, STORAGE_KEY } from './types';
import { checkAccess, } from './authUtils';
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
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK:", error);
        toast.error("Failed to initialize Pi Network SDK. Some features may be unavailable.");
        setIsSdkInitializedState(false);
      }
    };
    
    initSdk();
  }, []);

  // Update SDK initialized state when the global state changes
  useEffect(() => {
    const checkSdkState = () => {
      const currentState = isSdkInitialized();
      if (currentState !== isSdkInitializedState) {
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

  // Login function - using useCallback to avoid infinite loops
  const login = useCallback(async (): Promise<void> => {
    if (!isSdkInitializedState && isPiNetworkAvailable()) {
      try {
        console.log("Attempting to initialize SDK before login...");
        const result = await initializePiNetwork();
        setIsSdkInitializedState(result);
        
        if (!result) {
          toast.error("Failed to initialize Pi Network SDK. Please try again later.");
          return;
        }
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK during login:", error);
        toast.error("Failed to initialize Pi Network SDK. Please try again later.");
        return;
      }
    } else if (!isPiNetworkAvailable()) {
      // If Pi Network is not available at all, attempt to load the script
      toast.info("Loading Pi Network SDK. Please wait...");
      try {
        const result = await initializePiNetwork();
        setIsSdkInitializedState(result);
        
        if (!result) {
          toast.error("Failed to load Pi Network SDK. Please refresh the page and try again.");
          return;
        }
      } catch (error) {
        console.error("Failed to load Pi Network SDK:", error);
        toast.error("Failed to load Pi Network SDK. Please refresh the page and try again.");
        return;
      }
    }
    
    await performLogin(
      isSdkInitializedState,
      setIsLoading,
      setAuthError,
      (pending) => { pendingAuthRef.current = pending; },
      setUser
    );
  }, [isSdkInitializedState]);

  // Handle online/offline status
  const isOffline = useNetworkStatus(pendingAuthRef, login);

  // Check for stored session on mount and validate it
  useSessionCheck(isSdkInitializedState, login, setUser, setIsLoading);

  // Refresh user data without full login
  const refreshUserData = useCallback(async (): Promise<void> => {
    if (!isSdkInitializedState) {
      try {
        const result = await initializePiNetwork();
        setIsSdkInitializedState(result);
        
        if (!result) {
          toast.error("Failed to initialize Pi Network SDK. Please try again later.");
          return;
        }
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK during refresh:", error);
        return;
      }
    }
    
    await refreshUserDataService(user, setUser, setIsLoading);
  }, [user, isSdkInitializedState]);

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
