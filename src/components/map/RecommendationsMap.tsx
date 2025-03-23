
import React, { useState, useEffect } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from './MapComponent';
import Marker from './Marker';
import { renderMap } from './MapLoadingStates';
import { GOOGLE_MAPS_API_KEY, mapStylesWithoutMarkers, mapStylesWithMarkers } from './mapConfig';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface Place {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  category: string;
}

interface RecommendationsMapProps {
  places: Place[];
  selectedPlaceId: string | null;
  onMarkerClick: (placeId: string) => void;
  detailCardRef?: React.RefObject<HTMLDivElement>;
}

const RecommendationsMap: React.FC<RecommendationsMapProps> = ({ 
  places, 
  selectedPlaceId,
  onMarkerClick,
  detailCardRef
}) => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 37.7749, lng: -122.4194 });
  const [zoom, setZoom] = useState(13);
  const [showDefaultMarkers, setShowDefaultMarkers] = useState(false);

  // Find the selected place to center the map if needed
  useEffect(() => {
    if (selectedPlaceId) {
      const selectedPlace = places.find(place => place.id === selectedPlaceId);
      if (selectedPlace && selectedPlace.position) {
        setCenter(selectedPlace.position);
        setZoom(15); // Zoom in when a place is selected
        
        // Show a toast notification
        toast.info(`Viewing: ${selectedPlace.name}`, {
          description: selectedPlace.category,
          duration: 2000,
        });
      }
    }
  }, [selectedPlaceId, places]);

  const handleIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom() || 13);
    const mapCenter = map.getCenter();
    if (mapCenter) {
      setCenter({ lat: mapCenter.lat(), lng: mapCenter.lng() });
    }
  };

  // Toggle default markers visibility
  const toggleDefaultMarkers = () => {
    setShowDefaultMarkers(prev => !prev);
    
    // Show a toast notification
    toast.info(showDefaultMarkers ? 
      "Hidden business and park markers" : 
      "Showing business and park markers", {
      duration: 2000,
    });
  };

  return (
    <div className="w-full h-full relative">
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
          onIdle={handleIdle}
          mapTypeControl={false}
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={true}
          styles={showDefaultMarkers ? mapStylesWithMarkers : mapStylesWithoutMarkers}
        >
          {places.map((place) => (
            <Marker
              key={place.id}
              position={place.position}
              title={place.name}
              icon={{
                url: `data:image/svg+xml,
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${place.id === selectedPlaceId ? '%23047857' : '%238B5CF6'}" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                  </svg>`,
                scaledSize: { width: 36, height: 36 },
              }}
              onClick={() => onMarkerClick(place.id)}
              animation={place.id === selectedPlaceId ? 1 : undefined}
            />
          ))}
        </MapComponent>
      </Wrapper>
      
      {/* Toggle button for default markers */}
      <div className="absolute top-20 right-4 z-40">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={toggleDefaultMarkers}
          className="flex items-center gap-2 bg-white/90 shadow-md hover:bg-white"
        >
          {showDefaultMarkers ? (
            <>
              <EyeOff size={16} />
              <span className="hidden sm:inline">Hide POI Markers</span>
            </>
          ) : (
            <>
              <Eye size={16} />
              <span className="hidden sm:inline">Show POI Markers</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default RecommendationsMap;
