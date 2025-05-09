
import React from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
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

const MapComponent: React.FC<MapProps> = ({ places, selectedPlace, onMarkerClick }) => {
  return (
    <div className="absolute inset-0">
    <MapContainer 
      center={[37.7749, -122.4194]}  // San Francisco coordinates
      zoom={13} 
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false} // 🔥 disables the zoom buttons
      >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
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
    </MapContainer>
    </div>
  );
};

export default MapComponent;
