
import React from 'react';
import { Marker } from 'react-leaflet';
import { Place } from '@/data/mockPlaces';
import { createMarkerIcon } from '../markerUtils';

interface MapMarkersProps {
  places: Place[];
  activeMarkerId: string | null;
  onMarkerClick: (id: string) => void;
}

const MapMarkers: React.FC<MapMarkersProps> = ({ places, activeMarkerId, onMarkerClick }) => {
  return (
    <>
      {places.map(place => (
        <Marker
          key={place.id}
          position={[place.position.lat, place.position.lng]}
          icon={createMarkerIcon(place.id === activeMarkerId, place.isUserBusiness)}
          eventHandlers={{
            click: () => onMarkerClick(place.id)
          }}
        />
      ))}
    </>
  );
};

export default MapMarkers;
