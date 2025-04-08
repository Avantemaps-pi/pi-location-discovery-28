
import { useEffect } from 'react';
import { isPiNetworkAvailable } from '@/utils/piNetwork';
import { STORAGE_KEY, SESSION_TIMEOUT, PiUser } from './types';

// Track last session check to prevent too frequent checks
let lastSessionCheck = 0;
const SESSION_CHECK_THROTTLE_MS = 30000; // 30 seconds between checks

export const useSessionCheck = (
  isSdkInitialized: boolean,
  login: () => Promise<void>,
  setUser: (user: PiUser | null) => void,
  setIsLoading: (loading: boolean) => void
) => {
  useEffect(() => {
    if (!isSdkInitialized) return;
    
    const checkSession = async () => {
      try {
        // Throttle session checks
        const now = Date.now();
        if (now - lastSessionCheck < SESSION_CHECK_THROTTLE_MS) {
          console.log('Throttling session check, last check was', (now - lastSessionCheck)/1000, 'seconds ago');
          setIsLoading(false);
          return;
        }
        
        lastSessionCheck = now;
        console.log('Checking session validity');
        
        const storedSession = localStorage.getItem(STORAGE_KEY);
        
        if (storedSession) {
          const sessionData = JSON.parse(storedSession) as PiUser;
          const currentTime = Date.now();
          const sessionAge = currentTime - sessionData.lastAuthenticated;
          
          // Check if session is still valid (within 24 hours)
          if (sessionAge < SESSION_TIMEOUT) {
            console.log('Session is valid, age:', sessionAge/1000/60, 'minutes');
            setUser(sessionData);
          } else {
            console.log('Session expired, age:', sessionAge/1000/60, 'minutes, attempting re-login');
            // Session expired, clear it but don't auto-login
            localStorage.removeItem(STORAGE_KEY);
            setUser(null);
          }
        } else if (navigator.onLine && isPiNetworkAvailable()) {
          // No need for auto-login on initial page load
          console.log('No stored session found');
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [isSdkInitialized, login, setUser, setIsLoading]);
};
