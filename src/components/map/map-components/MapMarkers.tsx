
import React from 'react';
import { Marker, Popup } from 'react-leaflet';
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
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{place.name}</h3>
                  {place.description && (
                    <p className="text-sm mt-1 line-clamp-2">{place.description}</p>
                  )}
                  {place.category && (
                    <span className="inline-block px-2 py-1 mt-2 text-xs bg-purple-100 text-purple-800 rounded-full">
                      {place.category}
                    </span>
                  )}
                </div>
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
