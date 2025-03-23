
import React, { useRef, useEffect, useState } from 'react';

interface MapOptions {
  center: google.maps.LatLngLiteral;
  zoom: number;
  minZoom?: number;
  maxZoom?: number;
  mapId?: string;
  mapTypeControl?: boolean;
  fullscreenControl?: boolean;
  streetViewControl?: boolean;
  zoomControl?: boolean;
  styles?: any[];
}

// Map component that uses the Google Maps JavaScript API
interface MapProps extends MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

// Define a proper interface for children components that need the map prop
export interface MapChildProps {
  map?: google.maps.Map;
}

const MapComponent = ({ 
  onClick, 
  onIdle, 
  children, 
  center,
  zoom,
  ...options 
}: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  // Initialize the map
  useEffect(() => {
    if (ref.current && !map && window.google) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        ...options,
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom, options]);

  // Update map when center or zoom changes
  useEffect(() => {
    if (map) {
      map.setCenter(center);
      map.setZoom(zoom);
    }
  }, [map, center, zoom]);

  // Set up event listeners
  useEffect(() => {
    if (map) {
      if (window.google) {
        ['click', 'idle'].forEach((eventName) => 
          window.google.maps.event.clearListeners(map, eventName)
        );

        if (onClick) {
          map.addListener('click', onClick);
        }

        if (onIdle) {
          map.addListener('idle', () => onIdle(map));
        }
      }
    }
  }, [map, onClick, onIdle]);

  return (
    <>
      <div ref={ref} className="w-full h-full" />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // Type assertion to allow passing the map prop to children
          return React.cloneElement(child as React.ReactElement<MapChildProps>, { map });
        }
        return child;
      })}
    </>
  );
};

export default MapComponent;
