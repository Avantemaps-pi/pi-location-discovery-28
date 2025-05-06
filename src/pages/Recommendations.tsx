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
import styles from '@/styles/scroll-snap.module.css';

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

  return (
    <AppLayout title="Recommendations">
      <div className="w-full mx-auto recommendations-container mt-4 overflow-hidden h-[calc(100vh-80px)]">
        <div className="space-y-4 sm:space-y-5 overflow-y-auto h-[calc(100vh-94px)] px-2 pb-4">

          {[
            { title: 'Avante Top Choice', id: 'avanteTopChoice', data: avanteTopChoice },
            { title: 'Suggested for you', id: 'suggestedForYou', data: suggestedForYou },
            { title: 'Recommended for you', id: 'recommendedForYou', data: recommendedForYou },
          ].map(({ title, id, data }) => (
            <section
              key={id}
              className="relative"
              onMouseEnter={() => handleMouseEnter(id)}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => handleMouseEnter(id)}
            >
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
                {title}
              </h2>
              <Carousel className="w-full">
                {(activeSection === id || isMobile) && (
                  <>
                    <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-1" />
                    <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-1" />
                  </>
                )}
                <CarouselContent className={isMobile ? styles.scrollSnapContainer : 'ml-0'}>
                  {data.map((place) => (
                    <CarouselItem
                      key={place.id}
                      className={isMobile ? styles.scrollSnapItem : 'basis-[45%] md:basis-[35%] lg:basis-1/4 pl-0'}
                    >
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
