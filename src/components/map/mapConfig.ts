
// Map configuration constants
export const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco
export const defaultZoom = 12;
export const minZoom = 3;
export const maxZoom = 18;

// Tile layer configurations
export const OSM_TILE_LAYER = {
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
};

// Default marker colors for different business types
export const MARKER_COLORS = {
  DEFAULT: 'blue',
  RESTAURANT: 'red',
  RETAIL: 'green',
  SERVICES: 'orange',
  TECH: 'purple',
  HEALTH: 'pink',
  ENTERTAINMENT: 'yellow',
  EDUCATION: 'teal',
  USER_BUSINESS: 'gold'
};
