
import React, { useState } from 'react';
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
import { useIsMobile } from '@/hooks/use-mobile';

const Recommendations = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showControls, setShowControls] = useState({
    avanteTopChoice: false,
    suggestedForYou: false,
    recommendedForYou: false
  });
  
  const handlePlaceClick = (placeId: string) => {
    navigate('/', { state: { selectedPlaceId: placeId } });
  };

  const handleMouseEnter = (section: keyof typeof showControls) => {
    setShowControls(prev => ({ ...prev, [section]: true }));
  };

  const handleMouseLeave = (section: keyof typeof showControls) => {
    setShowControls(prev => ({ ...prev, [section]: false }));
  };

  const handleTouchStart = (section: keyof typeof showControls) => {
    setShowControls(prev => ({ ...prev, [section]: true }));
  };

  return (
    <AppLayout>
      <div className="w-full mx-auto px-2 sm:px-4">
        <div className="space-y-1 mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recommendations</h1>
          <p className="text-sm text-muted-foreground">Discover top-rated places that accept Pi cryptocurrency.</p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Avante Top Choice Section */}
          <section 
            className="animate-fade-in relative"
            onMouseEnter={() => handleMouseEnter('avanteTopChoice')}
            onMouseLeave={() => handleMouseLeave('avanteTopChoice')}
            onTouchStart={() => handleTouchStart('avanteTopChoice')}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Avante Top Choice
            </h2>
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {avanteTopChoice.map((place, index) => (
                  <CarouselItem key={place.id} className={`pl-0 ${isMobile ? 'basis-[85%]' : 'sm:basis-1/2 md:basis-1/3 lg:basis-1/4'}`}>
                    <div 
                      style={{animationDelay: `${index * 0.05}s`}} 
                      className="animate-fade-in"
                    >
                      <PlaceCard 
                        place={place} 
                        onPlaceClick={handlePlaceClick}
                        showDetails={true}
                        className="mx-auto max-w-[280px]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {showControls.avanteTopChoice && (
                <>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                </>
              )}
            </Carousel>
          </section>
          
          {/* Suggested for you Section */}
          <section 
            className="animate-fade-in relative"
            onMouseEnter={() => handleMouseEnter('suggestedForYou')}
            onMouseLeave={() => handleMouseLeave('suggestedForYou')}
            onTouchStart={() => handleTouchStart('suggestedForYou')}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Suggested for you
            </h2>
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {suggestedForYou.map((place, index) => (
                  <CarouselItem key={place.id} className={`pl-0 ${isMobile ? 'basis-[85%]' : 'sm:basis-1/2 md:basis-1/3 lg:basis-1/4'}`}>
                    <div 
                      style={{animationDelay: `${index * 0.05}s`}} 
                      className="animate-fade-in"
                    >
                      <PlaceCard 
                        place={place} 
                        onPlaceClick={handlePlaceClick}
                        showDetails={true}
                        className="mx-auto max-w-[280px]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {showControls.suggestedForYou && (
                <>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                </>
              )}
            </Carousel>
          </section>
          
          {/* Recommended for you Section */}
          <section 
            className="animate-fade-in relative"
            onMouseEnter={() => handleMouseEnter('recommendedForYou')}
            onMouseLeave={() => handleMouseLeave('recommendedForYou')}
            onTouchStart={() => handleTouchStart('recommendedForYou')}
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-2 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Recommended for you
            </h2>
            <Carousel className="w-full">
              <CarouselContent className="ml-0">
                {recommendedForYou.map((place, index) => (
                  <CarouselItem key={place.id} className={`pl-0 ${isMobile ? 'basis-[85%]' : 'sm:basis-1/2 md:basis-1/3 lg:basis-1/4'}`}>
                    <div 
                      style={{animationDelay: `${index * 0.05}s`}} 
                      className="animate-fade-in"
                    >
                      <PlaceCard 
                        place={place} 
                        onPlaceClick={handlePlaceClick}
                        showDetails={true}
                        className="mx-auto max-w-[280px]"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {showControls.recommendedForYou && (
                <>
                  <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                  <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                </>
              )}
            </Carousel>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
