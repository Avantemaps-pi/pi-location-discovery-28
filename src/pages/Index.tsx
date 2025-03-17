
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import GoogleMap from '@/components/map/GoogleMap';
import SearchBar from '@/components/map/SearchBar';

const Index = () => {
  return (
    <AppLayout fullHeight>
      <div className="relative h-full w-full">
        {/* Map Container */}
        <div className="h-full w-full">
          <GoogleMap />
        </div>
        
        {/* Search Bar overlaid on map */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4 md:px-0">
          <SearchBar />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
