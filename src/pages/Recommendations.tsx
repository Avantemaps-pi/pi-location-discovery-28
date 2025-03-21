
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { recommendedForYou, suggestedForYou, avanteTopChoice, allPlaces } from '@/data/mockPlaces';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlaceCard from '@/components/business/PlaceCard';

const Recommendations = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const navigate = useNavigate();
  
  const handlePlaceClick = (placeId) => {
    // Navigate to the index page with the selected place ID
    navigate('/', { state: { selectedPlaceId: placeId } });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommended Businesses</h1>
          <p className="text-muted-foreground mt-2">Discover top-rated places that accept Pi cryptocurrency as payment.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Avante Top Choice</h2>
              <div className="scroll-container">
                {avanteTopChoice.map((place) => (
                  <div key={place.id} className="w-64">
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      showDetails={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Suggested for you</h2>
              <div className="scroll-container">
                {suggestedForYou.map((place) => (
                  <div key={place.id} className="w-64">
                    <PlaceCard
                      place={place}
                      onPlaceClick={handlePlaceClick}
                      showDetails={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Recommended for you</h2>
              <div className="scroll-container">
                {recommendedForYou.map((place) => (
                  <div key={place.id} className="w-64">
                    <PlaceCard
                      place={place}
                      onPlaceClick={handlePlaceClick}
                      showDetails={false}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
