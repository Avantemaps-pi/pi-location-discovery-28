import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GoogleMap from '@/components/map/GoogleMap';
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

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (selectedPlace && mapRef.current && mapRef.current.contains(e.target as Node)) {
        const clickedElement = e.target as HTMLElement;
        const isClickInsidePopup = !!clickedElement.closest('.place-popup');
        const isClickOnMarker = !!clickedElement.closest('div[role="button"]');
        const isClickInsideDetailCard = detailCardRef.current && 
          (detailCardRef.current.contains(e.target as Node) || 
           detailCardRef.current === e.target);
        
        if (!isClickInsidePopup && !isClickOnMarker && !isClickInsideDetailCard) {
          setSelectedPlace(null);
        }
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [selectedPlace]);

  const handleSearch = (searchTerm: string) => {
    console.log('Search for:', searchTerm);
  };
  
  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  return (
    <AppLayout title="Avante Maps" withHeader={true} fullHeight={true}>
      <div className="relative h-full w-full" ref={mapRef}>
        <div className="absolute inset-0 z-0">
          <GoogleMap 
            places={allPlaces} 
            selectedPlaceId={selectedPlace} 
            onMarkerClick={handlePlaceClick}
            detailCardRef={detailCardRef}
          />
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
