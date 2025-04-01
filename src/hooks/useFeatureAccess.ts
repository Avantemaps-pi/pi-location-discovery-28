
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SubscriptionTier } from '@/utils/piNetworkUtils';
import { useEffect, useState } from 'react';

interface UseFeatureAccessOptions {
  redirectTo?: string;
  showToast?: boolean;
}

export const useFeatureAccess = (
  requiredTier: SubscriptionTier,
  options: UseFeatureAccessOptions = {}
) => {
  const { hasAccess, isAuthenticated, isLoading } = useAuth();
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const { redirectTo = '/pricing', showToast = true } = options;

  useEffect(() => {
    // Wait until auth is loaded
    if (!isLoading) {
      // Check if user is authenticated first
      if (!isAuthenticated) {
        setHasPermission(false);
        if (redirectTo) {
          navigate(redirectTo);
        }
        return;
      }

      // Now check if they have the required subscription
      const accessGranted = hasAccess(requiredTier);
      setHasPermission(accessGranted);

      // Redirect if they don't have access
      if (!accessGranted && redirectTo) {
        navigate(redirectTo, { 
          state: { 
            fromRestrictedPage: true,
            requiredTier: requiredTier 
          }
        });
      }
    }
  }, [isAuthenticated, isLoading, hasAccess, requiredTier, navigate, redirectTo]);

  return {
    hasPermission,
    isLoading: isLoading || hasPermission === null
  };
};
