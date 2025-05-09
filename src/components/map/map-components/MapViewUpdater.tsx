
import { useMap } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';

interface MapViewUpdaterProps {
  center: LatLngTuple;
  zoom: number;
}

const MapViewUpdater: React.FC<MapViewUpdaterProps> = ({ center, zoom }) => {
  const map = useMap();
  
  // Update the map view when center or zoom changes
  map.setView(center, zoom);
  
  return null;
};

export default MapViewUpdater;
