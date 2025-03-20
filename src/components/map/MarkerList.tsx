
import React from 'react';
import Marker from './Marker';
import { createMarkerIcon } from './markerUtils';
import { Place } from '@/data/mockPlaces';

interface MarkerListProps {
  places: Place[];
  activeMarker: string | null;
  showPopover: boolean;
  onMarkerClick: (id: string) => void;
  map?: google.maps.Map;
}

const MarkerList: React.FC<MarkerListProps> = ({ 
  places, 
  activeMarker, 
  showPopover, 
  onMarkerClick,
  map
}) => {
  return (
    <>
      {places.map((place) => (
        <React.Fragment key={place.id}>
          <Marker
            position={place.position}
            title={place.name}
            icon={createMarkerIcon(place.id === activeMarker)}
            onClick={() => onMarkerClick(place.id)}
            animation={place.id === activeMarker ? 1 : undefined}
            map={map}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default MarkerList;
