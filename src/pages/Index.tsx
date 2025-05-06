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
  const {
    places = [],              // default to empty array
    filteredPlaces = [],      // default to empty array
    isLoading = false,        // default to false
    handleSearch
  } = useBusinessData();

  useEffect(() => {
    if (location.state?.selectedPlaceId) {
      setSelectedPlace(location.state.selectedPlaceId);
    }
  }, [location.state]);

  useEffect(() => {
    // Debug logs to help confirm data is loading
    console.log('All Places:', places);
    console.log('Filtered Places:', filteredPlaces);
  }, [places, filteredPlaces]);

  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId || null);
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
        places={filteredPlaces.length > 0 ? filteredPlaces : places}
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
