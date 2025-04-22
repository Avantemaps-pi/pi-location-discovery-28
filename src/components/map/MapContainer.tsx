
import React from 'react';
import LeafletMap from './LeafletMap';
import { Place } from '@/data/mockPlaces';

interface MapContainerProps {
  places: Place[];
  filteredPlaces: Place[];
  selectedPlace: string | null;
  detailCardRef: React.RefObject<HTMLDivElement>;
  isLoading: boolean;
  onMarkerClick: (placeId: string) => void;
}

const MapContainer: React.FC<MapContainerProps> = ({
  places,
  filteredPlaces,
  selectedPlace,
  detailCardRef,
  isLoading,
  onMarkerClick,
}) => {
  return (
    <div className="absolute inset-0 top-16 w-full">
      <LeafletMap 
        places={filteredPlaces} 
        selectedPlaceId={selectedPlace} 
        onMarkerClick={onMarkerClick}
        detailCardRef={detailCardRef}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MapContainer;
