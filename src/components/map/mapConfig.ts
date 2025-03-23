import { MAPS_CONFIG } from '@/config/environment';

// Use the provided Google Maps API key from environment config
export const GOOGLE_MAPS_API_KEY = MAPS_CONFIG.apiKey;

// Example for demo data - in a real app, this would come from your MongoDB database
export const exampleLocations = [
  { id: 1, position: { lat: 37.7749, lng: -122.4194 }, title: "San Francisco Pi Cafe" },
  { id: 2, position: { lat: 37.7833, lng: -122.4167 }, title: "Pi Tech Store" },
  { id: 3, position: { lat: 37.7694, lng: -122.4862 }, title: "Pi Gadgets" },
  { id: 4, position: { lat: 37.7583, lng: -122.4267 }, title: "Pi Bakery" },
  { id: 5, position: { lat: 37.790, lng: -122.410 }, title: "Pi Electronics" },
];

// Enhanced map styling to hide all default markers, more comprehensive
export const mapStyles = [
  {
    featureType: "all",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "poi",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "transit",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "business",
    elementType: "all",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "administrative",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "landscape.man_made",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  },
  {
    featureType: "all",
    elementType: "labels.text",
    stylers: [{ visibility: "on" }]
  }
];

export const defaultCenter = MAPS_CONFIG.defaultCenter;
export const defaultZoom = MAPS_CONFIG.defaultZoom;
