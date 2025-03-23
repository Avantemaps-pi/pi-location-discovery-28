
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import CustomMapWithMarkers from '@/components/map/CustomMapWithMarkers';
import SearchBar from '@/components/map/SearchBar';
import { Button } from '@/components/ui/button';
import { allPlaces } from '@/data/mockPlaces';

const Index = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (location.state && location.state.selectedPlaceId) {
      setSelectedPlace(location.state.selectedPlaceId);
    }
  }, [location.state]);

  const handleSearch = (searchTerm: string) => {
    console.log('Search for:', searchTerm);
  };

  return (
    <AppLayout title="Avante Maps" withHeader={true} fullHeight={true}>
      <div className="relative h-full w-full" ref={mapRef}>
        <div className="absolute inset-0 z-0">
          <CustomMapWithMarkers />
        </div>
        
        <div className="absolute top-4 left-0 right-0 z-10 px-4">
          <div className="max-w-md mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholders={["Search for Address", "Search for Business name", "Search for Keywords"]}
              cycleInterval={3000}
            />
          </div>
        </div>
        
        <div className="absolute bottom-6 right-6 z-20">
          <Link to="/registration">
            <Button 
              className="h-14 w-14 rounded-full bg-avante-blue hover:bg-avante-blue/90 shadow-lg"
              aria-label="Register a business"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
