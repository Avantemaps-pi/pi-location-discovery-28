
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

  // Check if we were navigated here with a place ID to select
  useEffect(() => {
    if (location.state && location.state.selectedPlaceId) {
      setSelectedPlace(location.state.selectedPlaceId);
    }
  }, [location.state]);

  // Add click handler to detect clicks outside the map component
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // If we have a selected place and the click is on the map container (but not on a marker or popup)
      if (selectedPlace && mapRef.current && mapRef.current.contains(e.target as Node)) {
        // Check if the click is not on a popup (which would have a higher z-index)
        const clickedElement = e.target as HTMLElement;
        
        // Check if we clicked on the map background (not a popup or marker)
        // We consider a click outside if:
        // 1. It's not inside a popup (place-popup class)
        // 2. It's not on a marker element (role="button")
        // 3. It's not inside the detail card
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
    // Implement search functionality here
  };
  
  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  return (
    <AppLayout title="Avante Maps" withHeader={true} fullHeight={true}>
      {/* Map container with absolute positioning for overlays */}
      <div className="relative h-full w-full" ref={mapRef}>
        {/* Google Maps component as background */}
        <div className="absolute inset-0 z-0">
          <GoogleMap 
            places={allPlaces} 
            selectedPlaceId={selectedPlace} 
            onMarkerClick={handlePlaceClick}
            detailCardRef={detailCardRef}
          />
        </div>
        
        {/* Overlaid search box */}
        <div className="absolute top-4 left-0 right-0 z-10 px-4">
          <div className="max-w-md mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholders={["Search for Address", "Search for Business name"]}
              cycleInterval={3000}
            />
          </div>
        </div>
        
        {/* Floating action button for registration */}
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
