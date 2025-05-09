
import React, { useState, useEffect } from 'react';
import LeafletMap from '@/components/map/LeafletMap';
import AppLayout from '@/components/layout/AppLayout';
import { useBusinessData } from '@/hooks/useBusinessData';
import AddBusinessButton from '@/components/map/buttons/AddBusinessButton';
import '../styles/map.css';

const Index = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const { places = [], filteredPlaces = [], isLoading = false, handleSearch } = useBusinessData();

  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  useEffect(() => {
    // Add this effect to help with rendering the map
    const timer = setTimeout(() => {
      // Force a re-render after a short delay to ensure the map loads properly
      window.dispatchEvent(new Event('resize'));
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppLayout
      title="Avante Maps"
      withHeader={true}
      fullHeight={true}
      fullWidth={true}
      hideSidebar={false}
      onSearch={handleSearch}
      showSearch={true}
    >
      <div className="w-full h-full relative">
        <LeafletMap
          places={filteredPlaces.length > 0 ? filteredPlaces : places}
          selectedPlaceId={selectedPlace}
          onMarkerClick={handlePlaceClick}
          isLoading={isLoading}
        />
        <AddBusinessButton selectedPlace={selectedPlace} />
      </div>
    </AppLayout>
  );
};

export default Index;
