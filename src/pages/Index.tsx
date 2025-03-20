
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GoogleMap from '@/components/map/GoogleMap';
import SearchBar from '@/components/map/SearchBar';
import { Button } from '@/components/ui/button';
import { allPlaces } from '@/data/mockPlaces';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchTerm);
    // Implement search functionality here
  };
  
  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId);
  };

  return (
    <AppLayout title="Avante Maps" withHeader={true} fullHeight={true}>
      {/* Map container with absolute positioning for overlays */}
      <div className="relative h-full w-full">
        {/* Google Maps component as background */}
        <div className="absolute inset-0 z-0">
          <GoogleMap 
            places={allPlaces} 
            selectedPlaceId={selectedPlace} 
            onMarkerClick={handlePlaceClick}
          />
        </div>
        
        {/* Overlaid search box */}
        <div className="absolute top-4 left-0 right-0 z-10 px-4">
          <div className="max-w-md mx-auto">
            <SearchBar />
          </div>
        </div>
        
        {/* Floating action button for registration */}
        <div className="absolute bottom-6 right-6 z-10">
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
