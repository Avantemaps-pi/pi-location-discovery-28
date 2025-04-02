
import { useEffect, useRef } from 'react';
import { useAuth } from '@/context/auth';
import { toast } from 'sonner';

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const WARNING_BEFORE_TIMEOUT = 30 * 60 * 1000; // 30 minutes before timeout

export const useSessionTimeout = () => {
  const { user, logout, login } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeouts when the component unmounts or when the user changes
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, []);

  useEffect(() => {
    // Only set up timeouts if the user is logged in
    if (user) {
      const timeUntilExpiry = (user.lastAuthenticated + SESSION_TIMEOUT) - Date.now();
      const timeUntilWarning = timeUntilExpiry - WARNING_BEFORE_TIMEOUT;

      // Clear any existing timeouts
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);

      // Set a warning before the session expires
      if (timeUntilWarning > 0) {
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
        timeoutRef.current = setTimeout(() => {
          toast.error("Your session has expired. Please log in again.");
          logout();
        }, timeUntilExpiry);
      } else {
        // Session has already expired
        logout();
      }
    }
  }, [user, logout, login]);

  return null; // This hook doesn't return anything
};
