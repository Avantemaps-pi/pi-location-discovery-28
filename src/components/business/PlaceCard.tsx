import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, Bookmark, CircleCheck, ExternalLink, Info, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import DetailsCard from './DetailsCard';
import ExpandableDescription from './ExpandableDescription';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlaceCardProps {
  place: Place;
  onPlaceClick: (placeId: string) => void;
  onRemove?: (placeId: string) => void;
  className?: string;
  showDetails?: boolean;
  isBookmarked?: boolean;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ 
  place, 
  onPlaceClick, 
  onRemove, 
  className,
  showDetails = false,
  isBookmarked: initialIsBookmarked = false
}) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleRatingClick = () => {
    navigate(`/review/${place.id}`, { 
      state: { 
        businessDetails: place
      }
    });
  };

  const handlePlaceClick = () => {
    if (window.location.pathname === '/') {
      onPlaceClick(place.id);
    } else {
      navigate('/', { state: { selectedPlaceId: place.id } });
    }
  };
  
  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (onRemove && !isBookmarked === false) {
      onRemove(place.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Web Share API - falls back to copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: place.name,
        text: `Check out ${place.name} on Avante Maps`,
        url: window.location.origin + '?place=' + place.id
      }).catch(err => {
        console.error('Error sharing', err);
      });
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.origin + '?place=' + place.id);
      alert('Link copied to clipboard!');
    }
  };
  
  return (
    <Card 
      key={place.id} 
      className={`material-card card-hover ${className || 'w-full max-w-[300px]'}`}
    >
      <div 
        className="h-40 overflow-hidden cursor-pointer relative"
        onClick={handlePlaceClick}
      >
        <img 
          src={place.image} 
          alt={place.name} 
          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
          onError={(e) => {
            e.currentTarget.src = 'public/placeholder.svg';
            e.currentTarget.alt = 'Business Image';
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white"
            onClick={handleBookmarkToggle}
          >
            <Bookmark 
              className={`h-4 w-4 ${isBookmarked ? 'text-primary fill-primary' : 'text-gray-600'}`}
            />
          </Button>
          <Button 
            variant="secondary" 
            size="icon" 
            className="rounded-full w-8 h-8 bg-white/80 backdrop-blur-sm text-gray-800 hover:bg-white"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 text-gray-600" />
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-0 px-4 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <CircleCheck className="h-5 w-5 text-green-500" />
            </div>
            <CardTitle 
              className="text-base font-bold cursor-pointer hover:text-primary transition-colors line-clamp-1"
              onClick={handlePlaceClick}
            >
              {place.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-2 px-4 pb-4">
        <div 
          className="flex items-center gap-1 text-sm text-muted-foreground mb-2 cursor-pointer hover:text-primary transition-colors"
          onClick={handlePlaceClick}
        >
          <MapPin className="h-4 w-4 flex-shrink-0" />
          <span className="text-xs line-clamp-1">{place.address}</span>
        </div>
        
        <div className="h-24 mb-3 overflow-hidden">
          <ExpandableDescription text={place.description} maxLines={4} />
        </div>
        
        <div className="flex flex-wrap justify-between items-end mt-auto gap-2">
          <div className="flex flex-col gap-2">
            <div 
              className="inline-flex items-center px-2 py-1 rounded bg-amber-100 dark:bg-amber-950/40 cursor-pointer"
              onClick={handleRatingClick}
            >
              <Star className="h-4 w-4 text-amber-500 fill-amber-500 mr-1" />
              <span className="text-sm font-medium text-amber-800 dark:text-amber-400">{place.rating.toFixed(1)}</span>
            </div>
            <CategoryBadge category={place.category} />
          </div>
          
          <div className="flex flex-col gap-2 items-end">
            <Button 
              variant="default" 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-xs font-medium flex items-center gap-1 whitespace-nowrap"
            >
              Website
              <ExternalLink className="h-3 w-3" />
            </Button>
            {showDetails && (
              <Popover>
                <PopoverTrigger asChild>
                  <div className="text-primary font-medium text-sm cursor-pointer flex items-center whitespace-nowrap">
                    <Info className="h-3 w-3 mr-1" />
                    Details
                  </div>
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[420px]" align="end">
                  <DetailsCard place={place} />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
