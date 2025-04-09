
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { initializePiNetwork } from '@/utils/piNetwork';
import { PiUser, AuthContextType, STORAGE_KEY } from './types';
import { checkAccess } from './authUtils';
import { performLogin, refreshUserData as refreshUserDataService } from './authService';
import { useNetworkStatus } from './networkStatusService';
import { useSessionCheck } from './useSessionCheck';
import { createContext } from 'react';
import { SubscriptionTier } from '@/utils/piNetwork';

// Create the AuthContext here instead of importing it
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

// Time constants to control authentication frequency
const AUTH_MIN_INTERVAL = 5 * 60 * 1000; // 5 minutes between auth attempts

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState<boolean>(false);
  const pendingAuthRef = useRef<boolean>(false);
  const initAttempted = useRef<boolean>(false);
  const lastAuthTime = useRef<number>(0);

  // Initialize Pi Network SDK
  useEffect(() => {
    // Only attempt initialization once
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

  // Login function - using useCallback to avoid infinite loops
  const login = useCallback(async (): Promise<void> => {
    // Prevent repetitive authentication attempts
    const now = Date.now();
    if (now - lastAuthTime.current < AUTH_MIN_INTERVAL && user) {
      console.log("Skipping login - too soon since last authentication");
      return;
    }

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
    
    const success = await performLogin(
      isSdkInitialized,
      setIsLoading,
      setAuthError,
      (pending) => { pendingAuthRef.current = pending; },
      setUser
    );
    
    if (success) {
      lastAuthTime.current = now;
    }
  }, [isSdkInitialized, user]);

  // Handle online/offline status
  const isOffline = useNetworkStatus(pendingAuthRef, login);

  // Check for stored session on mount and validate it
  useSessionCheck(isSdkInitialized, login, setUser, setIsLoading);

  // Refresh user data without full login
  const refreshUserData = useCallback(async (): Promise<void> => {
    // Don't refresh too frequently
    const now = Date.now();
    if (now - lastAuthTime.current < AUTH_MIN_INTERVAL && user) {
      console.log("Skipping refresh - too soon since last authentication");
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
    
    const success = await refreshUserDataService(user, setUser, setIsLoading);
    if (success) {
      lastAuthTime.current = now;
    }
  }, [user, isSdkInitialized]);

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('pi_access_token');
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
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
