
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const handlePlaceClick = (placeId: string) => {
    navigate('/', { state: { selectedPlaceId: placeId } });
  };

  const handleMouseEnter = (section: string) => {
    setActiveSection(section);
  };

  const handleMouseLeave = () => {
    setActiveSection(null);
  };

  const getWidthClass = () => {
    if (isMobile) {
      return 'basis-full pl-0';
    }
    return 'basis-[45%] md:basis-[35%] lg:basis-1/4 pl-0';
  };

  return (
    <AppLayout title="Recommendations">
      <div className="w-full mx-auto recommendations-container mt-4 overflow-hidden h-[calc(100vh-80px)]">
        <div className="space-y-4 sm:space-y-5 overflow-y-auto h-[calc(100vh-94px)] px-2 pb-4">
          <section 
            className="relative"
            onMouseEnter={() => handleMouseEnter('avanteTopChoice')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleMouseEnter('avanteTopChoice')}
          >
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Avante Top Choice
            </h2>
            <Carousel className="w-full">
              {(activeSection === 'avanteTopChoice' || isMobile) && (
                <>
                  <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-1" />
                  <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-1" />
                </>
              )}
              <CarouselContent className="ml-0">
                {avanteTopChoice.map((place) => (
                  <CarouselItem key={place.id} className={`${getWidthClass()} mr-2`}>
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      className="w-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
          
          <section 
            className="relative"
            onMouseEnter={() => handleMouseEnter('suggestedForYou')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleMouseEnter('suggestedForYou')}
          >
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Suggested for you
            </h2>
            <Carousel className="w-full">
              {(activeSection === 'suggestedForYou' || isMobile) && (
                <>
                  <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-1" />
                  <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-1" />
                </>
              )}
              <CarouselContent className="ml-0">
                {suggestedForYou.map((place) => (
                  <CarouselItem key={place.id} className={`${getWidthClass()} mr-2`}>
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      className="w-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
          
          <section 
            className="relative"
            onMouseEnter={() => handleMouseEnter('recommendedForYou')}
            onMouseLeave={handleMouseLeave}
            onTouchStart={() => handleMouseEnter('recommendedForYou')}
          >
            <h2 className="text-xl font-semibold mb-2 flex items-center">
              <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
              Recommended for you
            </h2>
            <Carousel className="w-full">
              {(activeSection === 'recommendedForYou' || isMobile) && (
                <>
                  <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-1" />
                  <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-1" />
                </>
              )}
              <CarouselContent className="ml-0">
                {recommendedForYou.map((place) => (
                  <CarouselItem key={place.id} className={`${getWidthClass()} mr-2`}>
                    <PlaceCard 
                      place={place} 
                      onPlaceClick={handlePlaceClick}
                      className="w-full"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
