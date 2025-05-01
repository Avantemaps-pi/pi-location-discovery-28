
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import { Place } from '@/data/mockPlaces';
import { createMarkerIcon, createPopupContent } from '../markerUtils';
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
          const isActive = place.id === activeMarkerId;
          
          return (
            <Marker
              key={place.id}
              position={position}
              icon={createMarkerIcon(isActive, place.isUserBusiness)}
              eventHandlers={{
                click: () => onMarkerClick(place.id)
              }}
            >
              <Popup closeButton={false}>
                <div dangerouslySetInnerHTML={{ 
                  __html: createPopupContent(
                    place.name, 
                    place.description,
                    place.category
                  ) 
                }} />
              </Popup>
            </Marker>
          );
        }
        return null;
      })}
    </>
  );
};

export default MapMarkers;
