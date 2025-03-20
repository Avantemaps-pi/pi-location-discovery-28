
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import RecommendationsMap from '@/components/map/RecommendationsMap';
import CategorySection from '@/components/business/CategorySection';
import { recommendedForYou, suggestedForYou, avanteTopChoice, allPlaces } from '@/data/mockPlaces';

const Recommendations = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  const handlePlaceClick = (placeId) => {
    setSelectedPlace(placeId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommended Businesses</h1>
          <p className="text-muted-foreground mt-2">Discover top-rated places that accept Pi cryptocurrency as payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CategorySection 
              title="Recommended for you" 
              places={recommendedForYou} 
              onPlaceClick={handlePlaceClick} 
            />
            <CategorySection 
              title="Suggested for you" 
              places={suggestedForYou} 
              onPlaceClick={handlePlaceClick} 
            />
            <CategorySection 
              title="Avante Top Choice" 
              places={avanteTopChoice} 
              onPlaceClick={handlePlaceClick} 
            />
          </div>
          <div className="h-[500px] lg:h-auto rounded-lg overflow-hidden shadow-md">
            <RecommendationsMap 
              places={allPlaces} 
              selectedPlaceId={selectedPlace} 
              onMarkerClick={handlePlaceClick}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
