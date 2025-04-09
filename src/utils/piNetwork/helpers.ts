
/**
 * Helper utilities for the Pi Network SDK
 */

// Check if Pi Network SDK is available in the window object
export const isPiNetworkAvailable = (): boolean => {
  return typeof window !== 'undefined' && window.Pi !== undefined;
};

// Check if a session is expired based on timestamp
export const isSessionExpired = (timestamp: number, expiryMs: number = 24 * 60 * 60 * 1000): boolean => {
  const now = Date.now();
  return now - timestamp > expiryMs;
};

// Detect if we're running inside the Pi Browser
export const isRunningInPiBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  // Pi Browser user agent contains "PiBrowser"
  const userAgent = navigator.userAgent || '';
  return userAgent.includes('PiBrowser');
};
