
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
        // Ensure coordinates are valid numbers
        const lat = parseFloat(String(place.position.lat));
        const lng = parseFloat(String(place.position.lng));
        
        // Only create marker if coordinates are valid numbers
        if (!isNaN(lat) && !isNaN(lng)) {
          const position: LatLngTuple = [lat, lng];
          return (
            <Marker
              key={place.id}
              position={position}
              icon={createMarkerIcon(place.id === activeMarkerId, place.isUserBusiness)}
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
