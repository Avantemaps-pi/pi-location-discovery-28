// pages/index.tsx
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import MapComponent from '@/components/map/MapContainer';
import SearchContainer from '@/components/map/Search/SearchContainer';
import AddBusinessButton from '@/components/map/buttons/AddBusinessButton';
import { useBusinessData } from '@/hooks/useBusinessData';

const Index = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const { places = [], filteredPlaces = [], isLoading = false, handleSearch } = useBusinessData();

  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  return (
    <AppLayout
      title="Avante Maps"
      withHeader={true}
      fullHeight={true}
      fullWidth={true}
      hideSidebar={false}
    >
      <MapComponent
        places={filteredPlaces.length > 0 ? filteredPlaces : places}
        selectedPlace={selectedPlace}
        onMarkerClick={handlePlaceClick}
      />
      <SearchContainer onSearch={handleSearch} />
      <AddBusinessButton selectedPlace={selectedPlace} />
    </AppLayout>
  );
};

export default Index;
