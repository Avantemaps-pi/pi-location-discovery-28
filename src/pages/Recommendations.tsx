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

  const getWidthClass = () => {
    if (isMobile) {
      return 'basis-[90%] sm:basis-[90%]';
    }
    return 'basis-[90%] sm:basis-[45%] md:basis-[35%] lg:basis-1/4';
  };

  return (
    <AppLayout>
      <div className="w-full mx-auto recommendations-container">
        <div className="space-y-1 mb-3 sm:mb-4 px-2 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Recommendations</h1>
          <p className="text-sm text-muted-foreground">Discover top-rated places that accept Pi cryptocurrency.</p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          <section 
            className="relative"
            onMouseEnter={() => handleMouseEnter('avanteTopChoice')}
            onMouseLeave={() => handleMouseLeave('avanteTopChoice')}
            onTouchStart={() => handleTouchStart('avanteTopChoice')}
          >
            <h2 className="text-xl sm:text-xl font-semibold mb-2 flex items-center px-2 sm:px-4">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Avante Top Choice
            </h2>
            <Carousel className="w-full">
              {showControls.avanteTopChoice && (
                <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-2" />
              )}
              <CarouselContent className="ml-0">
                {avanteTopChoice.map((place) => (
                  <CarouselItem key={place.id} className={`pl-0 ${getWidthClass()} carousel-item-recommendations`}>
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      className="w-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {showControls.avanteTopChoice && (
                <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-2" />
              )}
            </Carousel>
          </section>
          
          <section 
            className="relative"
            onMouseEnter={() => handleMouseEnter('suggestedForYou')}
            onMouseLeave={() => handleMouseLeave('suggestedForYou')}
            onTouchStart={() => handleTouchStart('suggestedForYou')}
          >
            <h2 className="text-xl sm:text-xl font-semibold mb-2 flex items-center px-2 sm:px-4">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Suggested for you
            </h2>
            <Carousel className="w-full">
              {showControls.suggestedForYou && (
                <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-2" />
              )}
              <CarouselContent className="ml-0">
                {suggestedForYou.map((place) => (
                  <CarouselItem key={place.id} className={`pl-0 ${getWidthClass()} carousel-item-recommendations`}>
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      className="w-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {showControls.suggestedForYou && (
                <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-2" />
              )}
            </Carousel>
          </section>
          
          <section 
            className="relative"
            onMouseEnter={() => handleMouseEnter('recommendedForYou')}
            onMouseLeave={() => handleMouseLeave('recommendedForYou')}
            onTouchStart={() => handleTouchStart('recommendedForYou')}
          >
            <h2 className="text-xl sm:text-xl font-semibold mb-2 flex items-center px-2 sm:px-4">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Recommended for you
            </h2>
            <Carousel className="w-full">
              {showControls.recommendedForYou && (
                <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-2" />
              )}
              <CarouselContent className="ml-0">
                {recommendedForYou.map((place) => (
                  <CarouselItem key={place.id} className={`pl-0 ${getWidthClass()} carousel-item-recommendations`}>
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      className="w-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {showControls.recommendedForYou && (
                <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-2" />
              )}
            </Carousel>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
