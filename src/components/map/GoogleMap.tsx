import React, { useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from './MapComponent';
import Marker from './Marker';
import { renderMap } from './MapLoadingStates';
import { GOOGLE_MAPS_API_KEY, exampleLocations, mapStyles, defaultCenter, defaultZoom } from './mapConfig';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Circle, StarIcon } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CategoryBadge from '@/components/business/CategoryBadge';
import { useNavigate } from 'react-router-dom';

// Main Google Map component with wrapper
const GoogleMap: React.FC = () => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(defaultZoom);
  const [center, setCenter] = useState(defaultCenter);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);
  const [showPopover, setShowPopover] = useState(false);

  // Sample location data with more details
  const locationDetails = {
    id: "1",
    name: "Pi Tech Hub",
    description: "Technology store that specializes in gadgets and accepts Pi payments.",
    rating: 4.8,
    category: "Technology",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop"
  };

  const handleMarkerClick = (id: number) => {
    setActiveMarker(id);
    setShowPopover(true);
    // In a real app, you would show details about the location here
    console.log(`Clicked on marker ${id}`);
  };

  const handleRatingClick = (businessId: string) => {
    navigate(`/review/${businessId}`);
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
        <Button variant="link" className="text-blue-600 p-0 h-auto text-xs">
          More details
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
          {exampleLocations.map(({ id, position, title }) => (
            <React.Fragment key={id}>
              <Marker
                position={position}
                title={title}
                icon={{
                  url: `data:image/svg+xml,
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%238B5CF6" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="10" r="3"/>
                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                    </svg>`,
                  scaledSize: { width: 36, height: 36 },
                }}
                onClick={() => handleMarkerClick(id)}
                animation={activeMarker === id ? 1 : undefined}
              />
              {activeMarker === id && showPopover && (
                <div className="place-popup" id={`popup-${id}`}>
                  <PlaceCardPopup location={locationDetails} />
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
