
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { initializePiNetwork } from '@/utils/piNetworkUtils';
import { PiUser, AuthContextType, STORAGE_KEY } from './types';
import { checkAccess, } from './authUtils';
import { performLogin, refreshUserData as refreshUserDataService } from './authService';
import { useNetworkStatus } from './networkStatusService';
import { useSessionCheck } from './useSessionCheck';
import AuthContext from './useAuth';
import { SubscriptionTier } from '@/utils/piNetworkUtils';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<PiUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSdkInitialized, setIsSdkInitialized] = useState<boolean>(false);
  const pendingAuthRef = useRef<boolean>(false);

  // Initialize Pi Network SDK
  useEffect(() => {
    const initSdk = async () => {
      try {
        await initializePiNetwork();
        setIsSdkInitialized(true);
        console.log("Pi Network SDK initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Pi Network SDK:", error);
        toast.error("Failed to initialize Pi Network SDK");
      }
    };
    
    initSdk();
  }, []);

  // Login function - using useCallback to avoid infinite loops
  const login = useCallback(async (): Promise<void> => {
    await performLogin(
      isSdkInitialized,
      setIsLoading,
      setAuthError,
      (pending) => { pendingAuthRef.current = pending; },
      setUser
    );
  }, [isSdkInitialized]);

  // Handle online/offline status
  const isOffline = useNetworkStatus(pendingAuthRef, login);

  // Check for stored session on mount and validate it
  useSessionCheck(isSdkInitialized, login, setUser, setIsLoading);

  // Refresh user data without full login
  const refreshUserData = useCallback(async (): Promise<void> => {
    await refreshUserDataService(user, setUser, setIsLoading);
  }, [user]);

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
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
