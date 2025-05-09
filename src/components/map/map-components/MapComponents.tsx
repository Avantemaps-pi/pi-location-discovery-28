
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';  // Required for creating custom icons
import 'leaflet/dist/leaflet.css';

interface Place {
  id: string;
  name: string;
  description: string;
  rating: number;
  category: string;
  address: string;
  location: {   // This is correctly defined as 'location'
    lat: number;
    lng: number;
  };
  image: string;
}


interface MapProps {
  places: Place[];
  onMarkerClick: (id: string) => void;
}

const MapComponent: React.FC<MapProps> = ({ places, onMarkerClick }) => {
  return (
    <div className="absolute inset-0">
      <MapContainer 
        center={[37.7749, -122.4194]}  // San Francisco coordinates
        zoom={13} 
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {places.map((place) => (
          <Marker 
            key={place.id} 
            position={[place.location.lat, place.location.lng]} 
            eventHandlers={{
              click: () => onMarkerClick(place.id),  // Call the handler on click
            }}
          >
            <Popup>
              <div>
                <h3>{place.name}</h3>
                <p>{place.description}</p>
                <p><strong>Rating:</strong> {place.rating} / 5</p>
                <p><strong>Category:</strong> {place.category}</p>
                <p><strong>Address:</strong> {place.address}</p>
                <img src={place.image} alt={place.name} style={{ width: '100%', height: 'auto' }} />
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
