
import React, { forwardRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CircleCheck } from 'lucide-react';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';
import ExpandableDescription from '@/components/business/ExpandableDescription';
import BookmarkButton from './buttons/BookmarkButton';
import WebsiteButton from './buttons/WebsiteButton';
import PlaceImage from './place/PlaceImage';
import PlaceRating from './place/PlaceRating';
import PlaceAddress from './place/PlaceAddress';

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
          <BookmarkButton 
            isBookmarked={isBookmarked} 
            onToggle={handleBookmarkToggle} 
          />
        </div>
      </CardHeader>
      
      <PlaceImage 
        src={location.image} 
        alt={location.name} 
        onClick={handlePlaceClick} 
      />
      
      <CardContent className="pt-3 px-3">
        <PlaceAddress 
          address={location.address} 
          onClick={handlePlaceClick} 
        />
        
        <div className="h-16 mb-2">
          <ExpandableDescription text={location.description} maxLines={4} />
        </div>
        
        <div className="flex justify-between items-end mt-4">
          <div className="flex flex-col gap-1">
            <PlaceRating 
              rating={location.rating} 
              onClick={handleRatingClick} 
            />
            <CategoryBadge category={location.category} />
          </div>
          <div className="flex flex-col gap-2 items-end">
            <WebsiteButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

PlaceCardPopup.displayName = "PlaceCardPopup";

export default PlaceCardPopup;
