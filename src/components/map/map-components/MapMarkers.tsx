
import React from 'react';
import { Marker } from 'react-leaflet';
import { Place } from '@/data/mockPlaces';
import { createMarkerIcon } from '../markerUtils';
import { LatLngTuple } from 'leaflet';

interface MapMarkersProps {
  places: Place[];
  activeMarkerId: string | null;
  onMarkerClick: (id: string) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ places, activeMarkerId, onMarkerClick }) => {
  return (
    <>
      {places.map(place => {
        // Check for both position and location properties to handle different place formats
        const lat = place.position ? place.position.lat : undefined;
        const lng = place.position ? place.position.lng : undefined;
        
        // Only create marker if coordinates are valid numbers
        if (lat !== undefined && lng !== undefined && !isNaN(lat) && !isNaN(lng)) {
          const position: LatLngTuple = [lat, lng];
          const icon = createMarkerIcon(place.id === activeMarkerId, place.isUserBusiness);
          
          return (
            <Marker
              key={place.id}
              position={position}
              icon={icon}
              eventHandlers={{
                click: () => onMarkerClick(place.id)
              }}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default MapMarkers;
