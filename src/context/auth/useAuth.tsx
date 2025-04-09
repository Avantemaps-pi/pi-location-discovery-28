
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { requestUserPermissions, isPiNetworkAvailable } from '@/utils/piNetwork';
import { supabase } from '@/integrations/supabase/client';

// Define the auth context types
interface AuthUser {
  username: string;
  uid: string;
  walletAddress?: string;
  subscriptionTier?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: () => Promise<boolean>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  // Check for existing session
  useEffect(() => {
    const loadSession = async () => {
      setIsLoading(true);
      try {
        // Check if we have stored user data
        const storedUser = localStorage.getItem('pi_user');
        const storedToken = localStorage.getItem('pi_access_token');
        
        if (storedUser && storedToken) {
          try {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setAccessToken(storedToken);
            // Make token available globally for API calls
            // @ts-ignore
            window.piAuthToken = storedToken;
          } catch (e) {
            console.error('Error parsing stored user data', e);
          }
        }
      } catch (error) {
        console.error('Error loading session', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSession();
  }, []);
  
  const login = async (): Promise<boolean> => {
    if (!isPiNetworkAvailable()) {
      toast.error("Pi Network SDK not available. Please open in Pi Browser.");
      return false;
    }
    
    setIsLoading(true);
    try {
      // Request permissions from Pi Network
      const authResult = await requestUserPermissions();
      
      if (!authResult) {
        toast.error("Authentication failed");
        return false;
      }
      
      // Store user data and token
      const userData: AuthUser = {
        username: authResult.username,
        uid: authResult.uid,
        walletAddress: authResult.walletAddress
      };
      
      // Check if user exists in database or create them
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: authResult.uid,
          username: authResult.username,
          wallet_address: authResult.walletAddress
        })
        .select('subscription')
        .single();
        
      if (error) {
        console.error('Error saving user to database', error);
      } else if (data) {
        userData.subscriptionTier = data.subscription;
      }
      
      // Store user data and update state
      setUser(userData);
      
      // Store auth data in localStorage for persistence
      localStorage.setItem('pi_user', JSON.stringify(userData));
      
      // For demo purposes, we're using a fake token
      // In a real app, you would get the actual token from Pi Auth
      const fakeToken = `pi_fake_token_${Date.now()}`;
      setAccessToken(fakeToken);
      localStorage.setItem('pi_access_token', fakeToken);
      
      // Make token available globally for API calls
      // @ts-ignore
      window.piAuthToken = fakeToken;
      
      toast.success(`Welcome back, ${authResult.username}!`);
      return true;
      
    } catch (error) {
      console.error('Login error', error);
      toast.error("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('pi_user');
    localStorage.removeItem('pi_access_token');
    // @ts-ignore
    delete window.piAuthToken;
    toast.info("You've been logged out");
  }, []);
  
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      // Request fresh permissions to get updated wallet address
      const authResult = await requestUserPermissions();
      
      if (!authResult) {
        toast.error("Failed to refresh user data");
        return;
      }
      
      // Get subscription info from database
      const { data, error } = await supabase
        .from('users')
        .select('subscription')
        .eq('id', user.uid)
        .single();
        
      if (error) {
        console.error('Error getting user subscription', error);
      }
      
      // Update user data
      const updatedUser: AuthUser = {
        username: authResult.username,
        uid: authResult.uid,
        walletAddress: authResult.walletAddress,
        subscriptionTier: data?.subscription || user.subscriptionTier
      };
      
      setUser(updatedUser);
      localStorage.setItem('pi_user', JSON.stringify(updatedUser));
      
    } catch (error) {
      console.error('Error refreshing user data', error);
    }
  };
  
  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    accessToken,
    login,
    logout,
    refreshUserData
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Export the hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
