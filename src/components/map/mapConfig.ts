
import { MAPS_CONFIG } from '@/config/environment';

// Use the provided Google Maps API key from environment config
export const GOOGLE_MAPS_API_KEY = MAPS_CONFIG.apiKey;

// Example for demo data - in a real app, this would come from your MongoDB database
export const exampleLocations = [
  { id: 1, position: { lat: 37.7749, lng: -122.4194 }, title: "San Francisco Pi Cafe" },
  { id: 2, position: { lat: 37.7833, lng: -122.4167 }, title: "Pi Tech Store" },
  { id: 3, position: { lat: 37.7694, lng: -122.4862 }, title: "Pi Gadgets" },
  { id: 4, position: { lat: 37.7583, lng: -122.4267 }, title: "Pi Bakery" },
];

// Map styling to hide blue (business) and green (park) markers
export const mapStylesWithoutMarkers = [
  // Hide all points of interest (businesses, attractions)
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  // Hide business points of interest specifically
  {
    featureType: "poi.business",
    stylers: [{ visibility: "off" }]
  },
  // Hide parks specifically
  {
    featureType: "poi.park",
    stylers: [{ visibility: "off" }]
  },
  // Hide attractions
  {
    featureType: "poi.attraction",
    stylers: [{ visibility: "off" }]
  }
];

// Default map configuration
export const defaultCenter = MAPS_CONFIG.defaultCenter;
export const defaultZoom = MAPS_CONFIG.defaultZoom;
