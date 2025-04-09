
/**
 * Helper utilities for Pi Network SDK interactions
 */

// Check if Pi Network SDK is available
export const isPiNetworkAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Pi;
};

// Check if a session is expired
export const isSessionExpired = (lastAuthenticated: number, timeout: number): boolean => {
  return Date.now() - lastAuthenticated > timeout;
};
