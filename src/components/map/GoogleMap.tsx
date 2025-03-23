
import React, { useState, useEffect } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from './MapComponent';
import { renderMap } from './MapLoadingStates';
import { GOOGLE_MAPS_API_KEY, mapStylesWithoutMarkers, mapStylesWithMarkers, defaultCenter, defaultZoom } from './mapConfig';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';
import { toast } from 'sonner';
import { defaultLocations } from './defaultLocations';
import MarkerList from './MarkerList';
import PlaceCardPopup from './PlaceCardPopup';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface GoogleMapProps {
  places?: Place[];
  selectedPlaceId?: string | null;
  onMarkerClick?: (placeId: string) => void;
  detailCardRef?: React.RefObject<HTMLDivElement>;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  places = [], 
  selectedPlaceId = null,
  onMarkerClick,
  detailCardRef
}) => {
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(defaultZoom);
  const [center, setCenter] = useState(defaultCenter);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [showDefaultMarkers, setShowDefaultMarkers] = useState(false);

  // Use provided places or default locations
  const displayPlaces = places.length > 0 ? places : defaultLocations;

  // Find the selected place to center the map if needed
  useEffect(() => {
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
    } else {
      // Clear the active marker when selectedPlaceId is null
      setActiveMarker(null);
      setShowPopover(false);
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

  // Get the selected place data
  const selectedPlace = activeMarker ? displayPlaces.find(place => place.id === activeMarker) : null;

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
          styles={showDefaultMarkers ? mapStylesWithMarkers : mapStylesWithoutMarkers}
        >
          <MarkerList
            places={displayPlaces}
            activeMarker={activeMarker}
            showPopover={showPopover}
            onMarkerClick={handleMarkerClick}
            map={undefined}
          />
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
      
      {/* Popup card overlay for selected place */}
      {selectedPlace && showPopover && (
        <div className="fixed top-1/4 left-1/2 transform -translate-x-1/2 z-50 place-popup">
          <PlaceCardPopup location={selectedPlace} detailCardRef={detailCardRef} />
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
