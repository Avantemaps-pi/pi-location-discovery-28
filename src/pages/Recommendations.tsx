
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { recommendedForYou, suggestedForYou, avanteTopChoice } from '@/data/mockPlaces';
import PlaceCard from '@/components/business/PlaceCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from '@/hooks/use-mobile';

const Recommendations = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const handlePlaceClick = (placeId: string) => {
    navigate('/', {
      state: {
        selectedPlaceId: placeId
      }
    });
  };
  
  const handleMouseEnter = (section: string) => {
    setActiveSection(section);
  };
  
  const handleMouseLeave = () => {
    setActiveSection(null);
  };

  return (
    <AppLayout title="Recommendations">
      <div className="recommendations-container w-full max-w-5xl mx-auto mt-4 pb-6 overflow-hidden px-4 sm:px-6">
        <div className="space-y-6 sm:space-y-8 pb-1">
          {[{
            title: 'Avante Top Choice',
            data: avanteTopChoice,
            key: 'avanteTopChoice'
          }, {
            title: 'Suggested for you',
            data: suggestedForYou,
            key: 'suggestedForYou'
          }, {
            title: 'Recommended for you',
            data: recommendedForYou,
            key: 'recommendedForYou'
          }].map(({
            title,
            data,
            key
          }) => (
            <section key={key} 
              onMouseEnter={() => handleMouseEnter(key)} 
              onMouseLeave={handleMouseLeave} 
              onTouchStart={() => handleMouseEnter(key)} 
              className="relative w-full"
            >
              <h2 className="text-xl font-semibold mb-3 flex items-center">
                <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
                {title}
              </h2>
              <Carousel className="w-full overflow-hidden">
                {(activeSection === key || isMobile) && (
                  <>
                    <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                    <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7" />
                  </>
                )}
                <CarouselContent>
                  {data.map(place => (
                    <CarouselItem key={place.id} className="carousel-item-recommendations">
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
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
