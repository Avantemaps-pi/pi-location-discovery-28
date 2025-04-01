
/**
 * Utility functions for interacting with the Pi Network SDK
 */

// Check if Pi Network SDK is available
export const isPiNetworkAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Pi;
};

// Initialize the Pi Network SDK
export const initializePiNetwork = (): void => {
  // This is a placeholder - the Pi Network SDK is loaded via <script> tag
  // and should be globally available as window.Pi
  if (!isPiNetworkAvailable()) {
    console.warn('Pi Network SDK is not available. Loading from CDN...');
    
    // Create a script element to load the Pi SDK if it's not already available
    const script = document.createElement('script');
    script.src = 'https://sdk.minepi.com/pi-sdk.js';
    script.async = true;
    script.onload = () => {
      console.log('Pi Network SDK loaded successfully');
    };
    script.onerror = () => {
      console.error('Failed to load Pi Network SDK');
    };
    
    document.head.appendChild(script);
  }
};

// Check if a session is expired
export const isSessionExpired = (lastAuthenticated: number, timeout: number): boolean => {
  return Date.now() - lastAuthenticated > timeout;
};
