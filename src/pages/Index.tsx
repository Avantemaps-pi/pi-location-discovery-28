
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import MapContainer from '@/components/map/MapContainer';
import SearchContainer from '@/components/map/Search/SearchContainer';
import AddBusinessButton from '@/components/map/buttons/AddBusinessButton';
import { useBusinessData } from '@/hooks/useBusinessData';
import { useMediaQuery } from '@/hooks/use-mobile';

const Index = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);
  const { places, filteredPlaces, isLoading, handleSearch } = useBusinessData();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
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
      onSearch={handleSearch}
    >
      <MapContainer 
        places={places}
        filteredPlaces={filteredPlaces}
        selectedPlace={selectedPlace}
        detailCardRef={detailCardRef}
        isLoading={isLoading}
        onMarkerClick={handlePlaceClick}
      />
      {/* Only show SearchContainer on mobile */}
      {isMobile && <SearchContainer onSearch={handleSearch} />}
      <AddBusinessButton selectedPlace={selectedPlace} />
    </AppLayout>
  );
};

export default Index;
