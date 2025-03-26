
import React from 'react';
import PlaceCard from './PlaceCard';
import { Place } from '@/data/mockPlaces';

interface CategorySectionProps {
  title: string;
  places: Place[];
  onPlaceClick: (placeId: string) => void;
  showDetails?: boolean;
}

const CategorySection: React.FC<CategorySectionProps> = ({ 
  title, 
  places, 
  onPlaceClick,
  showDetails = false
}) => {
  return (
    <section className="mb-10 animate-fade-in overflow-hidden">
      <h2 className="text-xl font-semibold mb-5 flex items-center">
        <span className="bg-primary h-4 w-1 rounded-full mr-2"></span>
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {places.map((place, index) => (
          <div key={place.id} style={{animationDelay: `${index * 0.05}s`}} className="animate-fade-in">
            <PlaceCard 
              place={place} 
              onPlaceClick={onPlaceClick}
              showDetails={showDetails}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
