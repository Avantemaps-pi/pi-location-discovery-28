
// Use the provided Google Maps API key
export const GOOGLE_MAPS_API_KEY = "AIzaSyAp6za1pf11Tvq80kIRBpqqunXg4AcYa8s";

// Example for demo data - in a real app, this would come from your MongoDB database
export const exampleLocations = [
  { id: 1, position: { lat: 37.7749, lng: -122.4194 }, title: "San Francisco Pi Cafe" },
  { id: 2, position: { lat: 37.7833, lng: -122.4167 }, title: "Pi Tech Store" },
  { id: 3, position: { lat: 37.7694, lng: -122.4862 }, title: "Pi Gadgets" },
  { id: 4, position: { lat: 37.7583, lng: -122.4267 }, title: "Pi Bakery" },
];

// Map styling and configuration options
export const mapStyles = [
  {
    featureType: "poi",
    elementType: "labels",
    stylers: [{ visibility: "off" }]
  }
];

export const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

export const defaultZoom = 13;
