
import React from 'react';
import { MapContainer as LeafletMapContainer, TileLayer, Popup, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '@/lib/fix-leaflet-icons';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

interface Place {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface MapProps {
  places: Place[];
  selectedPlace: string | null;
  onMarkerClick: (id: string) => void;
}

// Simple MapViewUpdater component
const MapViewUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapComponent: React.FC<MapProps> = ({ places, selectedPlace, onMarkerClick }) => {
  return (
    <div className="absolute inset-0">
      <LeafletMapContainer 
        style={{ height: '100vh', width: '100%' }}
        className="leaflet-container"
      >
        <MapViewUpdater center={[37.7749, -122.4194]} zoom={13} />
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MarkerClusterGroup>
          {places.map((place) => (
            <Marker
              key={place.id}
              position={[place.location.lat, place.location.lng]}
              eventHandlers={{
                click: () => onMarkerClick(place.id),
              }}
            >
              <Popup>{place.name}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </LeafletMapContainer>
    </div>
  );
};

export default MapComponent;
