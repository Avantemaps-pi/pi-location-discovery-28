
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ZoomControl, ScaleControl } from 'react-leaflet';
import { Place } from '@/data/mockPlaces';
import { toast } from 'sonner';
import { defaultLocations } from './defaultLocations';
import { defaultCenter, defaultZoom, OSM_TILE_LAYER } from './mapConfig';
import 'leaflet/dist/leaflet.css';
import MapMarkers from './map-components/MapMarkers';
import MapViewUpdater from './map-components/MapViewUpdater';
import PlaceOverlay from './map-components/PlaceOverlay';
import LoadingOverlay from './map-components/LoadingOverlay';
import { LatLngTuple } from 'leaflet';

interface LeafletMapProps {
  places?: Place[];
  selectedPlaceId?: string | null;
  onMarkerClick?: (placeId: string) => void;
  detailCardRef?: React.RefObject<HTMLDivElement>;
  isLoading?: boolean;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  places = [], 
  selectedPlaceId = null,
  onMarkerClick,
  detailCardRef,
  isLoading = false
}) => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [showPopover, setShowPopover] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngTuple>([defaultCenter.lat, defaultCenter.lng]);
  const [zoom, setZoom] = useState(defaultZoom);

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
      {isLoading && <LoadingOverlay />}
      
      <MapContainer 
        center={mapCenter} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        zoomControl={false} 
        minZoom={3}
        maxZoom={18}
        attributionControl={true}
      >
        <TileLayer
          attribution={OSM_TILE_LAYER.attribution}
          url={OSM_TILE_LAYER.url}
        />
        
        <ZoomControl position="bottomright" />
        <ScaleControl position="bottomleft" imperial={false} />
        
        <MapViewUpdater center={mapCenter} zoom={zoom} />
        <MapMarkers places={displayPlaces} activeMarkerId={activeMarker} onMarkerClick={handleMarkerClick} />
      </MapContainer>
      
      <PlaceOverlay 
        selectedPlace={selectedPlace} 
        showPopover={showPopover} 
        onOverlayClick={handleOverlayClick}
        detailCardRef={detailCardRef}
      />
    </div>
  );
};

export default LeafletMap;
