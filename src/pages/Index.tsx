
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import MapContainer from '@/components/map/MapContainer';
import SearchContainer from '@/components/map/Search/SearchContainer';
import AddBusinessButton from '@/components/map/buttons/AddBusinessButton';
import { useBusinessData } from '@/hooks/useBusinessData';

const Index = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);
  const { places, filteredPlaces, isLoading, handleSearch } = useBusinessData();
  
  useEffect(() => {
    if (location.state && location.state.selectedPlaceId) {
      setSelectedPlace(location.state.selectedPlaceId);
    }
  }, [location.state]);

  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId === "" ? null : placeId);
  };

  return (
    <AppLayout 
      title="Avante Maps" 
      withHeader={true} 
      fullHeight={true} 
      fullWidth={true}
      hideSidebar={false}
    >
      <MapContainer 
        places={places}
        filteredPlaces={filteredPlaces}
        selectedPlace={selectedPlace}
        detailCardRef={detailCardRef}
        isLoading={isLoading}
        onMarkerClick={handlePlaceClick}
      />
      <SearchContainer onSearch={handleSearch} />
      <AddBusinessButton selectedPlace={selectedPlace} />
    </AppLayout>
  );
};

export default Index;
