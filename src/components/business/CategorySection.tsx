
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {places.map((place) => (
          <PlaceCard 
            key={place.id} 
            place={place} 
            onPlaceClick={onPlaceClick}
            showDetails={showDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
