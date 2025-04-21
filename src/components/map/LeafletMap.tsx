
import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngExpression } from 'leaflet';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';
import { toast } from 'sonner';
import { defaultLocations } from './defaultLocations';
import PlaceCardPopup from './PlaceCardPopup';
import { Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Default center coordinates (same as in mapConfig.ts)
const DEFAULT_CENTER: LatLngExpression = [37.7749, -122.4194];
const DEFAULT_ZOOM = 13;

interface LeafletMapProps {
  places?: Place[];
  selectedPlaceId?: string | null;
  onMarkerClick?: (placeId: string) => void;
  detailCardRef?: React.RefObject<HTMLDivElement>;
  isLoading?: boolean;
}

// Component to update the map center when selectedPlace changes
const ChangeMapView = ({ 
  center, 
  zoom 
}: { 
  center: LatLngExpression; 
  zoom: number 
}) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

// Create marker icons to match the original styling
const createMarkerIcon = (isActive: boolean, isUserBusiness?: boolean) => {
  const fillColor = isActive 
    ? '#047857'  // Green for active
    : isUserBusiness 
      ? '#EF4444'  // Red for user businesses
      : '#8B5CF6'; // Default purple
  
  const iconUrl = `data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${fillColor}" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="10" r="3"/>
      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
    </svg>`;

  return new Icon({
    iconUrl,
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  places = [], 
  selectedPlaceId = null,
  onMarkerClick,
  detailCardRef,
  isLoading = false
}) => {
  const navigate = useNavigate();
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  // Use provided places or default locations
  const displayPlaces = isLoading ? [] : places.length > 0 ? places : defaultLocations;

  // Find the selected place to center the map if needed
  useEffect(() => {
    if (selectedPlaceId) {
      const selectedPlace = displayPlaces.find(place => place.id === selectedPlaceId);
      if (selectedPlace && selectedPlace.position) {
        setMapCenter([selectedPlace.position.lat, selectedPlace.position.lng]);
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

  const handleOverlayClick = () => {
    setActiveMarker(null);
    setShowPopover(false);
    
    // Call the parent component's onMarkerClick with null if provided
    if (onMarkerClick) {
      onMarkerClick("");
    }
  };

  // Get the selected place data
  const selectedPlace = activeMarker ? displayPlaces.find(place => place.id === activeMarker) : null;

  return (
    <div className="w-full h-full relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-lg font-medium">Loading businesses...</p>
          </div>
        </div>
      )}
      
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={true}
        minZoom={3}
        maxZoom={18}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Update map view when center or zoom changes */}
        <ChangeMapView center={mapCenter} zoom={zoom} />
        
        {/* Render all markers */}
        {displayPlaces.map(place => (
          <Marker
            key={place.id}
            position={[place.position.lat, place.position.lng]}
            icon={createMarkerIcon(place.id === activeMarker, place.isUserBusiness)}
            eventHandlers={{
              click: () => handleMarkerClick(place.id)
            }}
          />
        ))}
      </MapContainer>
      
      {/* Greyish transparent overlay that appears when a place is selected */}
      {selectedPlace && showPopover && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-[2px]"
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Popup card overlay for selected place */}
      {selectedPlace && showPopover && (
        <div className="fixed top-28 left-1/2 transform -translate-x-1/2 z-50 place-popup">
          <PlaceCardPopup location={selectedPlace} detailCardRef={detailCardRef} />
        </div>
      )}
    </div>
  );
};

export default LeafletMap;
