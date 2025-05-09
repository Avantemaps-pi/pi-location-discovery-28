// pages/index.tsx
import React, { useState } from 'react';
import LeafletMap from '@/components/map/LeafletMap';
import AppLayout from '@/components/layout/AppLayout';
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
      <div className="w-full h-full">
        <LeafletMap
          places={filteredPlaces.length > 0 ? filteredPlaces : places}
          selectedPlaceId={selectedPlace}
          onMarkerClick={handlePlaceClick}
          isLoading={isLoading}
        />
        <SearchContainer onSearch={handleSearch} />
        <AddBusinessButton selectedPlace={selectedPlace} />
      </div>
    </AppLayout>
  );
};

export default Index;
