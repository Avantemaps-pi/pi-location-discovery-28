
// Default map configuration for Leaflet
export const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
export const defaultZoom = 13;

// Map layers
export const OSM_TILE_LAYER = {
  url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
};

// Map marker configuration
export const MARKER_COLORS = {
  active: '#047857',     // Green for active markers
  user: '#EF4444',       // Red for user businesses
  default: '#8B5CF6'     // Default purple for other markers
};
