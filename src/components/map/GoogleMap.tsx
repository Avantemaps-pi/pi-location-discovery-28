
import React, { useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from './MapComponent';
import Marker from './Marker';
import { renderMap } from './MapLoadingStates';
import { GOOGLE_MAPS_API_KEY, mapStyles, defaultCenter, defaultZoom } from './mapConfig';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Circle, StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';
import { toast } from 'sonner';

interface GoogleMapProps {
  places?: Place[];
  selectedPlaceId?: string | null;
  onMarkerClick?: (placeId: string) => void;
}

// Main Google Map component with wrapper
const GoogleMap: React.FC<GoogleMapProps> = ({ 
  places = [], 
  selectedPlaceId = null,
  onMarkerClick
}) => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(defaultZoom);
  const [center, setCenter] = useState(defaultCenter);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  // Default locations if no places are provided
  const defaultLocations = [
    {
      id: "1",
      name: "Pi Tech Hub",
      description: "Technology store that specializes in gadgets and accepts Pi payments.",
      rating: 4.8,
      category: "Technology",
      position: { lat: 37.775, lng: -122.419 },
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop"
    },
    {
      id: "2",
      name: "Pi Cafe",
      description: "Cozy cafe serving artisanal coffee and pastries with Pi payment options.",
      rating: 4.5,
      category: "Coffee Shop",
      position: { lat: 37.785, lng: -122.421 },
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1978&auto=format&fit=crop"
    },
    {
      id: "3",
      name: "Pi Bookstore",
      description: "Independent bookstore with a vast collection that accepts Pi cryptocurrency.",
      rating: 4.3,
      category: "Retail",
      position: { lat: 37.770, lng: -122.430 },
      image: "https://images.unsplash.com/photo-1521056787327-239a23f27ebb?q=80&w=2070&auto=format&fit=crop"
    },
    {
      id: "4",
      name: "Pi Bakery",
      description: "Fresh bread and pastries daily, accepting Pi payments.",
      rating: 4.7,
      category: "Food",
      position: { lat: 37.760, lng: -122.415 },
      image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop"
    },
    {
      id: "5",
      name: "Pi Electronics",
      description: "Electronics repair and sales shop that accepts Pi cryptocurrency.",
      rating: 4.2,
      category: "Technology",
      position: { lat: 37.790, lng: -122.410 },
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop"
    }
  ];

  // Use provided places or default locations
  const displayPlaces = places.length > 0 ? places : defaultLocations;

  // Find the selected place to center the map if needed
  React.useEffect(() => {
    if (selectedPlaceId) {
      const selectedPlace = displayPlaces.find(place => place.id === selectedPlaceId);
      if (selectedPlace && selectedPlace.position) {
        setCenter(selectedPlace.position);
        setZoom(15); // Zoom in when a place is selected
        setActiveMarker(selectedPlaceId);
        setShowPopover(true);
        
        // Show a toast notification
        toast.info(`Viewing: ${selectedPlace.name}`, {
          description: selectedPlace.category,
          duration: 2000,
        });
      }
    }
  }, [selectedPlaceId, displayPlaces]);

  const handleMarkerClick = (id: string) => {
    setActiveMarker(id);
    setShowPopover(true);
    
    // Call the parent component's onMarkerClick if provided
    if (onMarkerClick) {
      onMarkerClick(id);
    }
  };

  const handleRatingClick = (businessId: string) => {
    // Find business details by ID
    const businessDetails = displayPlaces.find(loc => loc.id === businessId);
    
    // Navigate to the review page with the business details
    navigate(`/review/${businessId}`, { 
      state: { 
        businessDetails: businessDetails 
      }
    });
  };

  const PlaceCardPopup = ({ location }) => (
    <Card className="w-[300px] shadow-md">
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
            <div className="flex items-center">
              <button 
                className="flex items-center hover:opacity-80 transition-opacity"
                onClick={() => handleRatingClick(location.id)}
              >
                {[...Array(5)].map((_, i) => (
                  <StarIcon 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(location.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'}`} 
                  />
                ))}
                <span className="text-sm ml-1">{location.rating.toFixed(1)}</span>
              </button>
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

  return (
    <div className="w-full h-full">
      <Wrapper 
        apiKey={GOOGLE_MAPS_API_KEY} 
        render={renderMap}
        libraries={['places']}
      >
        <MapComponent
          center={center}
          zoom={zoom}
          minZoom={3}
          maxZoom={18}
          mapId="avante_map_id"
          onIdle={(map) => {
            setZoom(map.getZoom() || defaultZoom);
            const mapCenter = map.getCenter();
            if (mapCenter) {
              setCenter({ lat: mapCenter.lat(), lng: mapCenter.lng() });
            }
          }}
          mapTypeControl={false}
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={true}
          styles={mapStyles}
        >
          {displayPlaces.map((place) => (
            <React.Fragment key={place.id}>
              <Marker
                position={place.position}
                title={place.name}
                icon={{
                  url: `data:image/svg+xml,
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${place.id === activeMarker ? '%23047857' : '%238B5CF6'}" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="10" r="3"/>
                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                    </svg>`,
                  scaledSize: { width: 36, height: 36 },
                }}
                onClick={() => handleMarkerClick(place.id)}
                animation={place.id === activeMarker ? 1 : undefined}
              />
              {activeMarker === place.id && showPopover && (
                <div className="place-popup" id={`popup-${place.id}`}>
                  <PlaceCardPopup location={place} />
                </div>
              )}
            </React.Fragment>
          ))}
        </MapComponent>
      </Wrapper>
    </div>
  );
};

export default GoogleMap;
