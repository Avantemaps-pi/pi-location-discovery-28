
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { initializePiNetwork } from '@/utils/piNetwork';
import { PiUser, AuthContextType, STORAGE_KEY } from './types';
import { checkAccess, } from './authUtils';
import { performLogin, refreshUserData } from './authService';
import { useNetworkStatus } from './networkStatusService';
import { useSessionCheck } from './useSessionCheck';
import AuthContext from './useAuth';
import { SubscriptionTier } from '@/utils/piNetwork';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState<boolean>(false);
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

  // Login function 
  const login = React.useCallback(async (): Promise<void> => {
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
    
    await performLogin(
      isSdkInitialized,
      setIsLoading,
      setAuthError,
      (pending) => { pendingAuthRef.current = pending; },
      setUser,
      setAccessToken
    );
  }, [isSdkInitialized]);

  // Handle online/offline status
  const isOffline = useNetworkStatus(pendingAuthRef, login);

  // Check for stored session on mount and validate it
  useSessionCheck(isSdkInitialized, login, setUser, setIsLoading);

  // Wrapped refreshUserData function to avoid re-authentication loops
  const refreshUserDataSafe = React.useCallback(async (): Promise<void> => {
    if (!user) return;
    await refreshUserData(user, setUser, setIsLoading);
  }, [user]);

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setAccessToken(null);
    toast.info("You've been logged out");
  };

  // Check if user has access to a feature based on their subscription
  const hasAccess = React.useCallback((requiredTier: SubscriptionTier): boolean => {
    if (!user) return false;
    return checkAccess(user.subscriptionTier, requiredTier);
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isOffline,
    accessToken,
    login,
    logout,
    authError,
    hasAccess,
    refreshUserData: refreshUserDataSafe
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
