
/**
 * Pi Browser detection utilities
 */

/**
 * Detects if the app is running in Pi Browser
 * Uses the User-Agent which will contain "PiBrowser" for the official Pi Browser
 */
export const isPiBrowser = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isInPiBrowser = userAgent.includes('pibrowser');
  
  // Log for debugging
  if (isInPiBrowser) {
    console.log('Pi Browser detected in user agent:', userAgent);
  }
  
  return isInPiBrowser;
};

/**
 * Gets the Pi platform app info if available
 */
export const getPiPlatformInfo = (): { platform?: string; version?: string } => {
  if (typeof navigator === 'undefined') return {};

  // Extract platform info from user agent if possible
  const userAgent = navigator.userAgent;
  
  // Basic extraction - would need refinement based on actual Pi Browser UA format
  const platformMatch = userAgent.match(/PiBrowser\/([0-9.]+)/i);
  
  return {
    platform: isPiBrowser() ? 'PiBrowser' : undefined,
    version: platformMatch ? platformMatch[1] : undefined
  };
};
