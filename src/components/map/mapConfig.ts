
// Default map configuration for Leaflet
export const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
export const defaultZoom = 13;

// Map layers
export const OSM_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Map marker configuration
export const MARKER_COLORS = {
  active: '#047857',     // Green for active markers
  user: '#EF4444',       // Red for user businesses
  default: '#8B5CF6'     // Default purple for other markers
};

// Google Maps API key (for backward compatibility with components still using Google Maps)
export const GOOGLE_MAPS_API_KEY = ''; // Empty key since we're migrating to Leaflet
