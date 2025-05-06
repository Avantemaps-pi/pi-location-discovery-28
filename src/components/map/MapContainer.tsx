import React from 'react';
import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';

// Fix for Leaflet's missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
    <MapContainer center={[-29.8587, 31.0218]} zoom={13} style={{ height: '100vh', width: '100%' }}>
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
  );
};

export default MapComponent;
