
import { Icon } from 'leaflet';
import { MARKER_COLORS } from './mapConfig';

// Function to create marker icon based on active state and business type for Leaflet
export const createMarkerIcon = (isActive: boolean, isUserBusiness?: boolean) => {
  const fillColor = isActive 
    ? MARKER_COLORS.DEFAULT  // Use DEFAULT as active color
    : isUserBusiness 
      ? MARKER_COLORS.USER_BUSINESS  // Use USER_BUSINESS for user businesses
      : MARKER_COLORS.DEFAULT; // Default
  
  const iconUrl = `data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${fillColor}" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
    </svg>`;

  return new Icon({
    iconUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};
