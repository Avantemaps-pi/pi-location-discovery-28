
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';

interface PlaceCardPopupProps {
  location: Place;
}

const PlaceCardPopup: React.FC<PlaceCardPopupProps> = ({ location }) => {
  const navigate = useNavigate();
  
  const handleRatingClick = (businessId: string) => {
    // Navigate to the review page with the business details
    navigate(`/review/${businessId}`, { 
      state: { 
        businessDetails: location
      }
    });
  };

  return (
    <Card className="w-[300px] shadow-md place-popup z-50">
      <div className="h-32 overflow-hidden">
        <img 
          src={location.image} 
          alt={location.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'public/placeholder.svg';
          }}
        />
      </div>
      <CardHeader className="pb-2 pt-3">
        <CardTitle className="text-base font-bold">{location.name}</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-sm text-gray-700 line-clamp-3 mb-2">{location.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <div 
              className="inline-flex items-center px-2 py-1 rounded bg-[#FEF7CD] cursor-pointer"
              onClick={() => handleRatingClick(location.id)}
            >
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-medium text-amber-800">{location.rating.toFixed(1)}</span>
            </div>
            <CategoryBadge category={location.category} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 pb-2 justify-end">
        <Button variant="default" size="sm" className="bg-green-500 hover:bg-green-600 text-xs font-medium">
          Website
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PlaceCardPopup;
