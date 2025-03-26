
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { recommendedForYou, suggestedForYou, avanteTopChoice } from '@/data/mockPlaces';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlaceCard from '@/components/business/PlaceCard';

const Recommendations = () => {
  const navigate = useNavigate();
  
  const handlePlaceClick = (placeId: string) => {
    navigate('/', { state: { selectedPlaceId: placeId } });
  };

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Recommendations</h1>
          <p className="text-muted-foreground">Discover top-rated places that accept Pi cryptocurrency as payment.</p>
        </div>

        <div className="space-y-12">
          {/* Avante Top Choice Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-xl font-semibold mb-5 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Avante Top Choice
            </h2>
            <ScrollArea orientation="horizontal" className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-4 pb-2">
                {avanteTopChoice.map((place, index) => (
                  <div 
                    key={place.id} 
                    style={{animationDelay: `${index * 0.05}s`}} 
                    className="animate-fade-in"
                  >
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      showDetails={true}
                      className="min-w-[280px] w-[280px]"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </section>
          
          {/* Suggested for you Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-xl font-semibold mb-5 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Suggested for you
            </h2>
            <ScrollArea orientation="horizontal" className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-4 pb-2">
                {suggestedForYou.map((place, index) => (
                  <div 
                    key={place.id} 
                    style={{animationDelay: `${index * 0.05}s`}} 
                    className="animate-fade-in"
                  >
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      showDetails={true}
                      className="min-w-[280px] w-[280px]"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </section>
          
          {/* Recommended for you Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-xl font-semibold mb-5 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Recommended for you
            </h2>
            <ScrollArea orientation="horizontal" className="w-full whitespace-nowrap pb-4">
              <div className="flex space-x-4 pb-2">
                {recommendedForYou.map((place, index) => (
                  <div 
                    key={place.id} 
                    style={{animationDelay: `${index * 0.05}s`}} 
                    className="animate-fade-in"
                  >
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      showDetails={true}
                      className="min-w-[280px] w-[280px]"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
