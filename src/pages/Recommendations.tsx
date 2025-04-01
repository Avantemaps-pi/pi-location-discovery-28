
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllMockPlaces, mockPlaceCategories } from '@/data/mockPlaces';
import PlaceCard from '@/components/business/PlaceCard';

const Recommendations = () => {
  const navigate = useNavigate();
  const allPlaces = getAllMockPlaces();
  const categorySectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  // State to track the current visible card in each category
  const [currentVisibleIndices, setCurrentVisibleIndices] = useState<Record<string, number>>(
    mockPlaceCategories.reduce((acc, category) => ({ ...acc, [category.name]: 0 }), {})
  );

  const handlePlaceClick = (placeId: string) => {
    navigate('/', { state: { selectedPlaceId: placeId } });
  };

  // Function to scroll to the next card in a category
  const scrollNext = (categoryName: string, placesInCategory: any[]) => {
    const currentIndex = currentVisibleIndices[categoryName];
    const newIndex = Math.min(currentIndex + 1, placesInCategory.length - 1);
    
    // Update the current visible index for this category
    setCurrentVisibleIndices(prev => ({
      ...prev,
      [categoryName]: newIndex
    }));
    
    // Find the category section and scroll to the next card
    const categoryIndex = mockPlaceCategories.findIndex(c => c.name === categoryName);
    const sectionRef = categorySectionsRef.current[categoryIndex];
    
    if (sectionRef) {
      const cardElements = sectionRef.querySelectorAll('.place-card-container');
      if (cardElements[newIndex]) {
        cardElements[newIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  // Function to scroll to the previous card in a category
  const scrollPrev = (categoryName: string) => {
    const currentIndex = currentVisibleIndices[categoryName];
    const newIndex = Math.max(currentIndex - 1, 0);
    
    // Update the current visible index for this category
    setCurrentVisibleIndices(prev => ({
      ...prev,
      [categoryName]: newIndex
    }));
    
    // Find the category section and scroll to the previous card
    const categoryIndex = mockPlaceCategories.findIndex(c => c.name === categoryName);
    const sectionRef = categorySectionsRef.current[categoryIndex];
    
    if (sectionRef) {
      const cardElements = sectionRef.querySelectorAll('.place-card-container');
      if (cardElements[newIndex]) {
        cardElements[newIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 md:px-6">
        <h1 className="text-3xl font-bold mb-6">Recommended For You</h1>
        
        {mockPlaceCategories.map((category, categoryIndex) => {
          const placesInCategory = allPlaces.filter(place => place.category === category.name);
          const currentIndex = currentVisibleIndices[category.name];
          
          return (
            <div 
              key={category.name} 
              className="mb-10 relative"
              ref={el => categorySectionsRef.current[categoryIndex] = el}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
                  {category.name}
                </h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollPrev(category.name)}
                    disabled={currentIndex === 0}
                    className="flex items-center justify-center h-8 w-8 rounded-full"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => scrollNext(category.name, placesInCategory)}
                    disabled={currentIndex === placesInCategory.length - 1}
                    className="flex items-center justify-center h-8 w-8 rounded-full"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
                {placesInCategory.map((place, placeIndex) => (
                  <div 
                    key={place.id} 
                    className="place-card-container min-w-[280px] max-w-[280px] snap-center relative"
                    style={{animationDelay: `${placeIndex * 0.05}s`}}
                  >
                    <div className="animate-fade-in w-full">
                      <div className="relative group">
                        {/* Previous Arrow - Visible on hover when not the first card */}
                        {placeIndex > 0 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollPrev(category.name);
                            }}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10 
                                     bg-white/80 text-gray-800 rounded-full p-1.5 shadow-md opacity-0 
                                     group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <ChevronLeft className="h-5 w-5" />
                          </button>
                        )}
                        
                        {/* PlaceCard component without the Details option */}
                        <div className="w-full">
                          <PlaceCard
                            place={place}
                            onPlaceClick={handlePlaceClick}
                            showDetails={false}
                            className="w-full"
                          />
                        </div>
                        
                        {/* Next Arrow - Visible on hover when not the last card */}
                        {placeIndex < placesInCategory.length - 1 && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              scrollNext(category.name, placesInCategory);
                            }}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-10 
                                     bg-white/80 text-gray-800 rounded-full p-1.5 shadow-md opacity-0
                                     group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Recommendations;
