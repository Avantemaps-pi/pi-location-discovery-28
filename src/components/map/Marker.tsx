
import { useState, useEffect } from 'react';
import { MapChildProps } from './MapComponent';

// We'll separate the MarkerOptions from MapChildProps to avoid the map property conflict
interface MarkerProps extends Omit<google.maps.MarkerOptions, 'map'>, MapChildProps {
  onClick?: () => void;
}

const Marker = ({ onClick, map, ...options }: MarkerProps) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  useEffect(() => {
    if (marker && map) {
      marker.setMap(map);
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker, map]);

  useEffect(() => {
    if (marker && onClick) {
      marker.addListener('click', onClick);
    }

    return () => {
      if (marker && onClick) {
        google.maps.event.clearListeners(marker, 'click');
      }
    };
  }, [marker, onClick]);

  return null;
};

export default Marker;
