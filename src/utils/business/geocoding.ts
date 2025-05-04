
/**
 * Geocoding utility that converts addresses to coordinates
 * Since Google Maps integration was removed, we're using a simplified version.
 */

interface Coordinates {
  lat: number;
  lng: number;
}

// This function now uses a simplified approach since Google Maps was removed
export const geocodeAddress = async (address: string): Promise<Coordinates | null> => {
  try {
    console.log('Geocoding address without Google Maps integration:', address);
    
    // Use Supabase edge function for geocoding if needed (future implementation)
    // For now, return a default location based on the address to allow testing
    
    // Using a simple deterministic algorithm to generate consistent coordinates based on the address string
    // This is a placeholder until proper geocoding is implemented
    const hash = hashString(address);
    
    // Generate lat/lng within reasonable bounds
    // Roughly corresponds to continental US boundaries
    const lat = 34 + (hash % 10) / 10;  // Between 34.0 and 34.9
    const lng = -118 + (hash % 20) / 10;  // Between -118.0 and -116.0
    
    console.log(`Generated coordinates for "${address}":`, { lat, lng });
    
    return { lat, lng };
  } catch (error) {
    console.error('Error in geocoding address:', error);
    return null;
  }
};

// Simple hashing function to generate consistent numbers from strings
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Make sure the hash is positive
  return Math.abs(hash);
};
