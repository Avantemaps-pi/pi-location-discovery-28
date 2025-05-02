
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isPiBrowser } from '@/utils/piNetwork/piNetworkDetection';
import { useAuth } from '@/context/auth';

/**
 * Hook to handle Pi Browser detection and redirection
 */
export const usePiRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Skip redirection if already on the Pi login page or already authenticated
    if (location.pathname === '/pi-login' || isAuthenticated) return;
    
    // If we're in Pi Browser and not authenticated, redirect to Pi-specific login
    if (isPiBrowser() && !isAuthenticated) {
      console.log('Pi Browser detected, redirecting to Pi login');
      navigate('/pi-login');
    }
  }, [location.pathname, navigate, isAuthenticated]);
};
