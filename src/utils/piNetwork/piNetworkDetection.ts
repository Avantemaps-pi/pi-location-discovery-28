
/**
 * Pi Browser detection utilities with performance optimizations
 */

// Cache the result of detection to avoid redundant checks
let _isPiBrowserCache: boolean | null = null;

/**
 * Detects if the app is running in Pi Browser
 * Uses the User-Agent which will contain "PiBrowser" for the official Pi Browser
 * Results are cached for performance
 */
export const isPiBrowser = (): boolean => {
  // Return cached result if available
  if (_isPiBrowserCache !== null) {
    return _isPiBrowserCache;
  }
  
  if (typeof navigator === 'undefined') {
    _isPiBrowserCache = false;
    return false;
  }
  
  // Use lowercase for case-insensitive matching
  const userAgent = navigator.userAgent.toLowerCase();
  const isInPiBrowser = userAgent.includes('pibrowser');
  
  // Cache the result
  _isPiBrowserCache = isInPiBrowser;
  
  if (isInPiBrowser) {
    console.log('Pi Browser detected in user agent:', userAgent);
  }
  
  return isInPiBrowser;
};

/**
 * Gets the Pi platform app info if available
 * Results are formatted consistently for usage
 */
export const getPiPlatformInfo = (): { platform?: string; version?: string } => {
  if (typeof navigator === 'undefined') return {};
  
  // Initialize detection if not already done
  const isPiApp = isPiBrowser();
  if (!isPiApp) return {};

  // Extract platform info from user agent if possible
  const userAgent = navigator.userAgent;
  
  // Optimized regex matching with capturing group
  const platformMatch = userAgent.match(/PiBrowser\/([0-9.]+)/i);
  
  return {
    platform: 'PiBrowser',
    version: platformMatch ? platformMatch[1] : undefined
  };
};

/**
 * Reset the cache - useful for testing or if user agent might change
 * (normally not needed in production)
 */
export const resetPiBrowserDetectionCache = (): void => {
  _isPiBrowserCache = null;
};
