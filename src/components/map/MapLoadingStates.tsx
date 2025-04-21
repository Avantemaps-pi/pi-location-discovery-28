
import React from 'react';
import { Loader2 } from 'lucide-react';

// Loading component for when the map is initializing
export const MapLoading = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="flex flex-col items-center">
      <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
      <p className="text-lg font-medium">Loading map...</p>
    </div>
  </div>
);

// Error component for when the map fails to load
export const MapLoadError = () => (
  <div className="flex h-full w-full items-center justify-center bg-red-50">
    <div className="text-center p-4">
      <p className="text-lg font-medium text-red-600 mb-2">Failed to load map</p>
      <p className="text-gray-500">Please check your internet connection and try again.</p>
    </div>
  </div>
);

// Function to render the appropriate loading state
export const renderMap = (status: string) => {
  if (status === 'LOADING') return <MapLoading />;
  if (status === 'FAILURE') return <MapLoadError />;
  return null;
};
