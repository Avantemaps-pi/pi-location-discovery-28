
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PlaceCard from '@/components/business/PlaceCard';
import { Place } from '@/data/mockPlaces';

interface CategorySectionProps {
  title: string;
  places: Place[];
  onPlaceClick: (placeId: string) => void;
}

const CategorySection: React.FC<CategorySectionProps> = ({ title, places, onPlaceClick }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <ScrollArea className="w-full" orientation="horizontal">
      <div className="flex space-x-4 pb-4 px-1">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} onPlaceClick={onPlaceClick} />
        ))}
      </div>
    </ScrollArea>
  </div>
);

export default CategorySection;
