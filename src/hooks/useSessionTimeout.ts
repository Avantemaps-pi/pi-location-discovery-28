
import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const WARNING_BEFORE_TIMEOUT = 30 * 60 * 1000; // 30 minutes before timeout

export const useSessionTimeout = () => {
  const { user, logout, login } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const setupCompleteRef = useRef<boolean>(false);

  useEffect(() => {
    // Clear any existing timeouts when the component unmounts or when the user changes
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, []);

  useEffect(() => {
    // Prevent multiple setups when user doesn't change
    if (setupCompleteRef.current && user) {
      return;
    }
    
    // Only set up timeouts if the user is logged in
    if (user) {
      setupCompleteRef.current = true;
      
      // Make sure lastAuthenticated exists before using it
      const lastAuth = user.lastAuthenticated || Date.now();
      const timeUntilExpiry = (lastAuth + SESSION_TIMEOUT) - Date.now();
      const timeUntilWarning = timeUntilExpiry - WARNING_BEFORE_TIMEOUT;

      console.log('Setting up session timeout, expires in:', timeUntilExpiry/1000/60, 'minutes');

      // Clear any existing timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);

      // Set a warning before the session expires
      if (timeUntilWarning > 0) {
        console.log('Warning will show in:', timeUntilWarning/1000/60, 'minutes');
        warningRef.current = setTimeout(() => {
          toast.warning("Your session will expire soon. Would you like to stay logged in?", {
            action: {
              label: "Stay logged in",
              onClick: () => login()
            },
            duration: 10000,
          });
        }, timeUntilWarning);
      }

      // Set a timeout to log the user out when the session expires
      if (timeUntilExpiry > 0) {
        console.log('Logout will trigger in:', timeUntilExpiry/1000/60, 'minutes');
        timeoutRef.current = setTimeout(() => {
          toast.error("Your session has expired. Please log in again.");
          logout();
        }, timeUntilExpiry);
      } else {
        // Session has already expired
        console.log('Session already expired');
        logout();
      }
    } else {
      setupCompleteRef.current = false;
    }
  }, [user, logout, login]);

  return null;
};
