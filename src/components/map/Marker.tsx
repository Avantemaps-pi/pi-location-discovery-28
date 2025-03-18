
import { useState, useEffect } from 'react';
import { MapChildProps } from './MapComponent';

// We'll separate the MarkerOptions from MapChildProps to avoid the map property conflict
interface MarkerProps extends MapChildProps {
  position: google.maps.LatLngLiteral;
  title?: string;
  icon?: {
    url: string;
    scaledSize: { width: number; height: number };
  };
  onClick?: () => void;
  animation?: number;
}

const Marker = ({ onClick, map, position, title, icon, animation }: MarkerProps) => {
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);

  useEffect(() => {
    if (!marker) {
      if (!map || !window.google) return;
      
      const newMarker = new window.google.maps.Marker({
        position,
        map,
        title,
      });
      setMarker(newMarker);
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, map, position, title]);

  useEffect(() => {
    if (marker && icon && window.google) {
      const iconObj = {
        ...icon,
        scaledSize: new window.google.maps.Size(icon.scaledSize.width, icon.scaledSize.height),
      };
      marker.setIcon(iconObj);
    }
  }, [marker, icon]);

  useEffect(() => {
    if (marker && animation !== undefined && window.google) {
      marker.setAnimation(animation);
    }
  }, [marker, animation]);

  useEffect(() => {
    if (marker && onClick) {
      const listener = marker.addListener('click', onClick);
      return () => {
        window.google.maps.event.removeListener(listener);
      };
    }
  }, [marker, onClick]);

  return null;
};

export default Marker;
