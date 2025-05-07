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
  const getWidthClass = () => {
    if (isMobile) {
      return 'basis-[78%] pl-0'; // Further slimmed for mobile (reduced from 80% to 78%)
    }
    return 'basis-[28%] md:basis-[22%] lg:basis-[17%] pl-0'; // Further slimmed for desktop (reduced percentages)
  };
  return <AppLayout title="Recommendations">
      <div className="w-full mx-auto mt-4 pb-6 overflow-y-auto">
        <div className="space-y-4 sm:space-y-5 pb-1 px-0">
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
        }) => <section key={key} onMouseEnter={() => handleMouseEnter(key)} onMouseLeave={handleMouseLeave} onTouchStart={() => handleMouseEnter(key)} className="relative max-w-[92%] mx-auto">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
                {title}
              </h2>
              <Carousel className="w-full">
                {(activeSection === key || isMobile) && <>
                    <CarouselPrevious className="absolute left-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -ml-1" />
                    <CarouselNext className="absolute right-0 z-10 bg-white/80 backdrop-blur-sm shadow-md border-0 transition-opacity duration-300 h-7 w-7 -mr-1" />
                  </>}
                <CarouselContent className="ml-0">
                  {data.map(place => <CarouselItem key={place.id} className={`${getWidthClass()} pr-2`}>
                      <PlaceCard place={place} onPlaceClick={handlePlaceClick} className="w-full" />
                    </CarouselItem>)}
                </CarouselContent>
              </Carousel>
            </section>)}
        </div>
      </div>
    </AppLayout>;
};
export default Recommendations;