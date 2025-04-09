
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GoogleMap from '@/components/map/GoogleMap';
import SearchBar from '@/components/map/SearchBar';
import { Button } from '@/components/ui/button';
import { allPlaces } from '@/data/mockPlaces';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useAuth } from '@/context/auth';
import { isPiNetworkAvailable } from '@/utils/piNetwork';
import { toast } from 'sonner';

const Index = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);
  const { refreshUserData } = useAuth();
  const initialLoadRef = useRef<boolean>(true);
  
  // Use the session timeout hook
  useSessionTimeout();

  // Initialize Pi Network SDK on initial load - only once
  useEffect(() => {
    const setupPiNetwork = async () => {
      if (initialLoadRef.current) {
        initialLoadRef.current = false;
        try {
          if (isPiNetworkAvailable()) {
            console.log('Pi Network SDK available');
          } else {
            console.log('Pi Network SDK not available - app will work with limited functionality');
          }
        } catch (error) {
          console.error('Failed to initialize Pi Network SDK:', error);
          toast.error('Failed to initialize Pi Network features');
        }
      }
    };
    
    setupPiNetwork();
  }, []);

  // Attempt to refresh user data on initial load - only once
  useEffect(() => {
    if (initialLoadRef.current) {
      refreshUserData();
    }
  }, [refreshUserData]);

  useEffect(() => {
    if (location.state && location.state.selectedPlaceId) {
      setSelectedPlace(location.state.selectedPlaceId);
    }
  }, [location.state]);

  const handleSearch = (searchTerm: string) => {
    console.log('Search for:', searchTerm);
  };
  
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
      <div className="absolute inset-0 top-16 w-full" ref={mapRef}>
        <GoogleMap 
          places={allPlaces} 
          selectedPlaceId={selectedPlace} 
          onMarkerClick={handlePlaceClick}
          detailCardRef={detailCardRef}
        />
        
        <div className="absolute top-4 left-0 right-0 z-10 px-4">
          <div className="max-w-md mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholders={["Search for Address", "Search for Business name", "Search for Keywords"]}
              cycleInterval={3000}
            />
          </div>
        </div>
        
        <div className={`absolute bottom-6 ${selectedPlace ? 'right-16 md:right-[calc(50%+200px)]' : 'right-6'} z-20 transition-all duration-300`}>
          <Link to="/registration">
            <Button 
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
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
