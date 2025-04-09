
/**
 * Helper functions for Pi Network integration
 */

// Check if Pi Network SDK is available in the current environment
export const isPiNetworkAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.Pi !== 'undefined';
};

// Check if the current session is expired based on the last authentication time
export const isSessionExpired = (lastAuthTime?: number, expiryMinutes: number = 60): boolean => {
  if (!lastAuthTime) return true;
  
  const expiryMilliseconds = expiryMinutes * 60 * 1000;
  const currentTime = new Date().getTime();
  
  return currentTime - lastAuthTime > expiryMilliseconds;
};

// Check if the app is running in the Pi Browser
export const isRunningInPiBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.includes('pibrowser');
};
