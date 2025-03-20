
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, Bookmark, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';

interface PlaceCardProps {
  place: Place;
  onPlaceClick: (placeId: string) => void;
  onRemove?: (placeId: string) => void;
  className?: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, onPlaceClick, onRemove, className }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();
  
  const handleRatingClick = () => {
    navigate(`/review/${place.id}`, { 
      state: { 
        businessDetails: place
      }
    });
  };

  const handlePlaceClick = () => {
    // If we're already on the index page, just select the marker
    if (window.location.pathname === '/') {
      onPlaceClick(place.id);
    } else {
      // Navigate to the index page with the place ID as a parameter
      navigate('/', { state: { selectedPlaceId: place.id } });
    }
  };
  
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    setIsBookmarked(!isBookmarked);
    if (onRemove && !isBookmarked === false) {
      onRemove(place.id);
    }
  };
  
  return (
    <Card key={place.id} className={`shadow-md border-gray-200 ${className || 'min-w-[250px] w-full flex-shrink-0'}`}>
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <CircleCheck className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle 
              className="text-base font-bold cursor-pointer hover:text-blue-500 transition-colors"
              onClick={handlePlaceClick}
            >
              {place.name}
            </CardTitle>
          </div>
          <Bookmark 
            className={`h-5 w-5 cursor-pointer ${isBookmarked ? 'text-blue-500 fill-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={handleBookmarkToggle}
          />
        </div>
      </CardHeader>
      
      <div 
        className="h-40 overflow-hidden px-3 cursor-pointer"
        onClick={handlePlaceClick}
      >
        <div className="bg-gray-100 h-full flex items-center justify-center rounded-md">
          <img 
            src={place.image} 
            alt={place.name} 
            className="w-full h-full object-cover rounded-md hover:opacity-90 transition-opacity"
            onError={(e) => {
              e.currentTarget.src = 'public/placeholder.svg';
              e.currentTarget.alt = 'Business Image';
            }}
          />
        </div>
      </div>
      
      <CardContent className="pt-3 px-3">
        <div 
          className="flex items-center gap-1 text-sm text-gray-600 mb-2 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={handlePlaceClick}
        >
          <MapPin className="h-4 w-4" />
          <span className="text-xs">{place.address}</span>
        </div>
        <p className="text-sm text-gray-700 line-clamp-4 h-20 mb-2">{place.description}</p>
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <button 
                className="flex items-center hover:opacity-90 transition-opacity"
                onClick={handleRatingClick}
              >
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(place.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm font-medium ml-1">{place.rating.toFixed(1)}</span>
              </button>
            </div>
            <CategoryBadge category={place.category} />
          </div>
          <div>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-xs font-medium"
            >
              Website
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
