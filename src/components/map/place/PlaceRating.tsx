
import React from 'react';
import { Star } from 'lucide-react';

interface PlaceRatingProps {
  rating: number;
  onClick: () => void;
}

const PlaceRating: React.FC<PlaceRatingProps> = ({ rating, onClick }) => {
  return (
    <div 
      className="inline-flex items-center px-2 py-1 w-14 justify-center rounded bg-[#FEF7CD] cursor-pointer"
      onClick={onClick}
    >
      <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
      <span className="text-xs font-medium text-amber-800">{rating.toFixed(1)}</span>
    </div>
  );
};

export default PlaceRating;
