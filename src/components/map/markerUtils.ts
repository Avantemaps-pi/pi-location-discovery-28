
import { Icon, DivIcon } from 'leaflet';
import { MARKER_COLORS } from './mapConfig';

// Function to create marker icon based on active state and business type for Leaflet
export const createMarkerIcon = (isActive: boolean, isUserBusiness?: boolean) => {
  const fillColor = isActive 
    ? MARKER_COLORS.active  // Green for active
    : isUserBusiness 
      ? MARKER_COLORS.user  // Red for user businesses
      : MARKER_COLORS.default; // Default purple
  
  const iconUrl = `data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${fillColor}" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>`;

  return new Icon({
    iconUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
    className: 'leaflet-marker-icon'
  });
};

// Function to create a popup content div icon for markers
export const createPopupContent = (name: string, description?: string, category?: string) => {
  const truncatedDesc = description && description.length > 60 
    ? description.substring(0, 60) + '...' 
    : description;

  return `
    <div class="marker-popup">
      <h3 class="text-base font-bold">${name}</h3>
      ${category ? `<div class="text-xs text-muted-foreground">${category}</div>` : ''}
      ${truncatedDesc ? `<p class="text-sm mt-1">${truncatedDesc}</p>` : ''}
    </div>
  `;
};
