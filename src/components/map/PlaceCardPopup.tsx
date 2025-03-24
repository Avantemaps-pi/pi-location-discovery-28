
import React, { forwardRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Bookmark, CircleCheck, ExternalLink, MapPin } from 'lucide-react';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DetailsCard from '@/components/business/DetailsCard';
import { useState } from 'react';
import ExpandableDescription from '@/components/business/ExpandableDescription';

interface PlaceCardPopupProps {
  location: Place;
  detailCardRef?: React.RefObject<HTMLDivElement>;
}

const PlaceCardPopup = forwardRef<HTMLDivElement, PlaceCardPopupProps>(({ 
  location,
  detailCardRef
}, ref) => {
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  const handleRatingClick = () => {
    // Navigate to the review page with the business details
    navigate(`/review/${location.id}`, { 
      state: { 
        businessDetails: location
      }
    });
  };

  const handlePlaceClick = () => {
    // If we're already on the index page, just select the marker
    if (window.location.pathname === '/') {
      // Do nothing, we're already viewing this place
    } else {
      // Navigate to the index page with the place ID as a parameter
      navigate('/', { state: { selectedPlaceId: location.id } });
    }
  };
  
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    setIsBookmarked(!isBookmarked);
  };

  return (
    <Card className="w-[300px] shadow-md border-gray-200 place-popup z-[100]" ref={ref}>
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <CircleCheck className="h-5 w-5 text-green-500" />
            </div>
            <CardTitle 
              className="text-base font-bold cursor-pointer hover:text-blue-500 transition-colors"
              onClick={handlePlaceClick}
            >
              {location.name}
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
            src={location.image} 
            alt={location.name} 
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
          <span className="text-xs">{location.address}</span>
        </div>
        
        <div className="h-16 mb-2">
          <ExpandableDescription text={location.description} maxLines={4} />
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-col gap-1">
            <div 
              className="inline-flex items-center px-2 py-1 w-16 justify-center rounded bg-[#FEF7CD] cursor-pointer"
              onClick={handleRatingClick}
            >
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-medium text-amber-800">{location.rating.toFixed(1)}</span>
            </div>
            <CategoryBadge category={location.category} />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Button 
              variant="default" 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-xs font-medium flex items-center gap-1"
            >
              Website
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PlaceCardPopup.displayName = "PlaceCardPopup";

export default PlaceCardPopup;
