
import React, { useState, useRef } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from './MapComponent';
import { renderMap } from './MapLoadingStates';
import { GOOGLE_MAPS_API_KEY, mapStyles, defaultCenter, defaultZoom } from './mapConfig';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { PlusCircle, Trash2, MapPin, X } from 'lucide-react';

interface CustomMarker {
  id: string;
  position: google.maps.LatLngLiteral;
}

interface CustomMapWithMarkersProps {
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
}

const CustomMapWithMarkers: React.FC<CustomMapWithMarkersProps> = ({
  initialCenter = defaultCenter,
  initialZoom = defaultZoom
}) => {
  const [center, setCenter] = useState(initialCenter);
  const [zoom, setZoom] = useState(initialZoom);
  const [markers, setMarkers] = useState<CustomMarker[]>([]);
  const [showLocationDot, setShowLocationDot] = useState(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const googleMarkers = useRef<Map<string, google.maps.Marker>>(new Map());
  
  const handleMapIdle = (map: google.maps.Map) => {
    if (!mapRef.current) {
      mapRef.current = map;
    }
    
    setZoom(map.getZoom() || initialZoom);
    const mapCenter = map.getCenter();
    if (mapCenter) {
      setCenter({ lat: mapCenter.lat(), lng: mapCenter.lng() });
    }
  };

  const addRandomMarker = () => {
    if (!mapRef.current) return;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    
    // Generate random coordinates within the current map bounds
    const lat = sw.lat() + (ne.lat() - sw.lat()) * Math.random();
    const lng = sw.lng() + (ne.lng() - sw.lng()) * Math.random();
    
    const newMarker: CustomMarker = {
      id: `marker-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      position: { lat, lng }
    };
    
    setMarkers(prev => [...prev, newMarker]);
  };

  const clearAllMarkers = () => {
    setMarkers([]);
  };

  const removeMarker = (markerId: string) => {
    setMarkers(prev => prev.filter(marker => marker.id !== markerId));
  };

  const renderMarkers = (map: google.maps.Map | undefined) => {
    if (!map || !window.google) return null;

    // Clean up any markers that are no longer in state
    googleMarkers.current.forEach((marker, id) => {
      if (!markers.find(m => m.id === id)) {
        marker.setMap(null);
        googleMarkers.current.delete(id);
      }
    });

    return markers.map(marker => {
      // If marker already exists, update its position (if needed)
      if (googleMarkers.current.has(marker.id)) {
        const existingMarker = googleMarkers.current.get(marker.id);
        existingMarker?.setPosition(marker.position);
        return null;
      }

      // Create new marker
      const newGoogleMarker = new window.google.maps.Marker({
        position: marker.position,
        map,
        animation: window.google.maps.Animation.DROP,
        title: `Marker ${marker.id}`,
      });

      // Add click listener
      newGoogleMarker.addListener('click', () => {
        removeMarker(marker.id);
      });

      googleMarkers.current.set(marker.id, newGoogleMarker);
      return null;
    });
  };

  const toggleLocationDot = () => {
    setShowLocationDot(prev => !prev);
    if (mapRef.current) {
      mapRef.current.setOptions({
        myLocationEnabled: !showLocationDot,
        myLocationButtonEnabled: !showLocationDot
      });
    }
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
          mapId="custom_map_id"
          onIdle={handleMapIdle}
          mapTypeControl={false}
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={true}
          styles={mapStyles}
          myLocationEnabled={showLocationDot}
          myLocationButtonEnabled={showLocationDot}
        >
          {renderMarkers}
        </MapComponent>
      </Wrapper>

      {/* Control Panel */}
      <div className="absolute bottom-24 right-6 flex flex-col gap-3">
        <Button 
          className="h-12 w-12 rounded-full bg-green-600 hover:bg-green-700"
          onClick={addRandomMarker}
          title="Add Random Marker"
        >
          <PlusCircle className="h-6 w-6" />
        </Button>
        
        <Button 
          className="h-12 w-12 rounded-full bg-red-600 hover:bg-red-700"
          onClick={clearAllMarkers}
          title="Remove All Markers"
          disabled={markers.length === 0}
        >
          <Trash2 className="h-6 w-6" />
        </Button>
      </div>

      {/* Location Dot Toggle */}
      <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md flex items-center gap-2">
        <MapPin className="h-5 w-5 text-blue-500" />
        <div className="text-sm">My Location</div>
        <Switch 
          checked={showLocationDot} 
          onCheckedChange={toggleLocationDot} 
        />
      </div>

      {/* Marker List */}
      {markers.length > 0 && (
        <div className="absolute top-4 left-4 bg-white p-3 rounded-md shadow-md max-h-60 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Custom Markers ({markers.length})</h3>
          </div>
          <ul className="space-y-2">
            {markers.map(marker => (
              <li key={marker.id} className="flex items-center justify-between text-xs">
                <span>
                  {marker.position.lat.toFixed(4)}, {marker.position.lng.toFixed(4)}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => removeMarker(marker.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomMapWithMarkers;
