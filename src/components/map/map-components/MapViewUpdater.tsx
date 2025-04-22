
import React from 'react';
import { useMap } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

interface MapViewUpdaterProps {
  center: LatLngExpression;
  zoom: number;
}

// Component to update the map center when selectedPlace changes
const MapViewUpdater: React.FC<MapViewUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

export default MapViewUpdater;
