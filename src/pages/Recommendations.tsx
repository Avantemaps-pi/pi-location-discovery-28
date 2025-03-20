
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, ExternalLink, Info, Bookmark, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import RecommendationsMap from '@/components/map/RecommendationsMap';

// Mock data for different categories
const recommendedForYou = [
  {
    id: '1',
    name: 'Pi Tech Hub',
    address: '123 Innovation Ave, San Francisco, CA',
    description: 'A technology store that specializes in gadgets and accepts Pi as payment.',
    rating: 4.8,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop',
    position: { lat: 37.775, lng: -122.419 }
  },
  {
    id: '2',
    name: 'Crypto Cafe',
    address: '456 Blockchain St, San Francisco, CA',
    description: 'A modern cafe with great coffee and pastries, proudly accepting Pi cryptocurrency.',
    rating: 4.5,
    category: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1978&auto=format&fit=crop',
    position: { lat: 37.785, lng: -122.421 }
  },
  {
    id: '3',
    name: 'Pi Fashion Boutique',
    address: '789 Style Blvd, San Francisco, CA',
    description: 'Trendy clothing store with the latest fashions that accepts Pi payments.',
    rating: 4.6,
    category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
    position: { lat: 37.770, lng: -122.430 }
  },
];

const suggestedForYou = [
  {
    id: '4',
    name: 'Pi Wellness Center',
    address: '101 Healthy Way, San Francisco, CA',
    description: 'Spa and wellness center offering services with Pi cryptocurrency payment options.',
    rating: 4.7,
    category: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    position: { lat: 37.760, lng: -122.415 }
  },
  {
    id: '5',
    name: 'Pi Book Shop',
    address: '202 Reader Lane, San Francisco, CA',
    description: 'Independent bookstore with a wide selection of titles and Pi payment options.',
    rating: 4.4,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1521056787327-239a23f27ebb?q=80&w=2070&auto=format&fit=crop',
    position: { lat: 37.790, lng: -122.410 }
  },
  {
    id: '6',
    name: 'Pi Organic Market',
    address: '303 Green St, San Francisco, CA',
    description: 'Fresh organic produce and locally sourced goods available with Pi payments.',
    rating: 4.5,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop',
    position: { lat: 37.780, lng: -122.425 }
  },
];

const avanteTopChoice = [
  {
    id: '7',
    name: 'Pi Computing',
    address: '404 Tech Blvd, San Francisco, CA',
    description: 'Premium computer and tech repair service that accepts Pi for all services.',
    rating: 4.9,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    position: { lat: 37.795, lng: -122.405 }
  },
  {
    id: '8',
    name: 'Pi Restaurant',
    address: '505 Culinary Ave, San Francisco, CA',
    description: 'Fine dining establishment with innovative cuisine and Pi payment options.',
    rating: 4.8,
    category: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
    position: { lat: 37.765, lng: -122.420 }
  },
  {
    id: '9',
    name: 'Pi Adventure Tours',
    address: '606 Explorer Way, San Francisco, CA',
    description: 'Guided tours and outdoor adventures that accept Pi cryptocurrency.',
    rating: 4.7,
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1533619242606-bb0a792f90a3?q=80&w=2070&auto=format&fit=crop',
    position: { lat: 37.755, lng: -122.435 }
  },
];

// Combine all places for the map
const allPlaces = [...recommendedForYou, ...suggestedForYou, ...avanteTopChoice];

const PlaceCard = ({ place, onPlaceClick }) => {
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
    onPlaceClick(place.id);
  };
  
  return (
    <Card key={place.id} className="min-w-[250px] w-72 flex-shrink-0 shadow-md border-gray-200">
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
            onClick={() => setIsBookmarked(!isBookmarked)}
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
        <p className="text-sm text-gray-700 line-clamp-4 h-20 mb-2">{place.description}</p>
        <div 
          className="flex items-center gap-1 text-sm text-gray-600 mb-2 cursor-pointer hover:text-blue-500 transition-colors"
          onClick={handlePlaceClick}
        >
          <MapPin className="h-4 w-4" />
          <span className="text-xs">{place.address}</span>
        </div>
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

const CategorySection = ({ title, places, onPlaceClick }) => (
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

const Recommendations = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  const handlePlaceClick = (placeId) => {
    setSelectedPlace(placeId);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommended Businesses</h1>
          <p className="text-muted-foreground mt-2">Discover top-rated places that accept Pi cryptocurrency as payment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <CategorySection 
              title="Recommended for you" 
              places={recommendedForYou} 
              onPlaceClick={handlePlaceClick} 
            />
            <CategorySection 
              title="Suggested for you" 
              places={suggestedForYou} 
              onPlaceClick={handlePlaceClick} 
            />
            <CategorySection 
              title="Avante Top Choice" 
              places={avanteTopChoice} 
              onPlaceClick={handlePlaceClick} 
            />
          </div>
          <div className="h-[500px] lg:h-auto rounded-lg overflow-hidden shadow-md">
            <RecommendationsMap 
              places={allPlaces} 
              selectedPlaceId={selectedPlace} 
              onMarkerClick={handlePlaceClick}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
