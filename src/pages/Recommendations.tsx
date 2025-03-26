
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { recommendedForYou, suggestedForYou, avanteTopChoice } from '@/data/mockPlaces';
import PlaceCard from '@/components/business/PlaceCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
            <Carousel className="w-full">
              <CarouselContent>
                {avanteTopChoice.map((place, index) => (
                  <CarouselItem key={place.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div 
                      style={{animationDelay: `${index * 0.05}s`}} 
                      className="animate-fade-in"
                    >
                      <PlaceCard 
                        place={place} 
                        onPlaceClick={handlePlaceClick}
                        showDetails={true}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
          </section>
          
          {/* Suggested for you Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-xl font-semibold mb-5 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Suggested for you
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {suggestedForYou.map((place, index) => (
                  <CarouselItem key={place.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div 
                      style={{animationDelay: `${index * 0.05}s`}} 
                      className="animate-fade-in"
                    >
                      <PlaceCard 
                        place={place} 
                        onPlaceClick={handlePlaceClick}
                        showDetails={true}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
          </section>
          
          {/* Recommended for you Section */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-xl font-semibold mb-5 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Recommended for you
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {recommendedForYou.map((place, index) => (
                  <CarouselItem key={place.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                    <div 
                      style={{animationDelay: `${index * 0.05}s`}} 
                      className="animate-fade-in"
                    >
                      <PlaceCard 
                        place={place} 
                        onPlaceClick={handlePlaceClick}
                        showDetails={true}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 sm:left-4" />
              <CarouselNext className="right-2 sm:right-4" />
            </Carousel>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
