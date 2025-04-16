
import { useEffect } from 'react';
import { useAuth } from '@/context/auth';

/**
 * Hook to restore the user's session when they return to the app
 * and handle automatic session management
 */
export const useSessionRestoration = () => {
  const { user, isOffline, refreshUserData } = useAuth();

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && user && !isOffline) {
        // User has returned to the app after being away
        console.log("User returned to app, checking session status");
        
        // Get the last refresh time from localStorage
        const lastRefresh = localStorage.getItem('last_user_refresh');
        const refreshThreshold = 5 * 60 * 1000; // 5 minutes
        
        // Only refresh if it's been more than the threshold since last refresh
        if (!lastRefresh || (Date.now() - parseInt(lastRefresh, 10) > refreshThreshold)) {
          refreshUserData();
          localStorage.setItem('last_user_refresh', Date.now().toString());
        }
      }
    };

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user, isOffline, refreshUserData]);

  // Handle network status changes
  useEffect(() => {
    const handleOnline = () => {
      if (user) {
        console.log("Network connection restored, refreshing user data");
        refreshUserData();
      }
    };

    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user, refreshUserData]);

  return null;
};
