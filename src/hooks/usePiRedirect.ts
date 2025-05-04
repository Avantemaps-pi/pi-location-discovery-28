
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isPiBrowser } from '@/utils/piNetwork/piNetworkDetection';
import { useAuth } from '@/context/auth';

/**
 * Hook to handle Pi Browser detection and redirection with performance optimizations
 */
export const usePiRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const redirectPerformed = useRef(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Perform the check immediately on first render using a separate effect
  useEffect(() => {
    // Skip performance-intensive checks if we've already redirected
    if (redirectPerformed.current) return;

    // Quick synchronous check 
    const isPi = isPiBrowser();
    const isAlreadyOnLoginPage = location.pathname === '/pi-login';
    
    // Only set redirection flag if needed
    if (isPi && !isAuthenticated && !isAlreadyOnLoginPage) {
      setShouldRedirect(true);
    }
  }, []);
  
  // Perform the actual redirection in a separate effect to avoid blocking initial render
  useEffect(() => {
    if (shouldRedirect && !redirectPerformed.current) {
      console.log('Pi Browser detected, redirecting to Pi login');
      // Mark as redirected to prevent multiple redirects
      redirectPerformed.current = true;
      
      // Defer the redirect slightly to allow the UI to render first
      setTimeout(() => {
        navigate('/pi-login');
      }, 50);
    }
  }, [shouldRedirect, navigate]);
};
