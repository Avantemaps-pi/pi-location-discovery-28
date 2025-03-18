
import React, { useRef, useEffect, useState } from 'react';

// Map component that uses the Google Maps JavaScript API
interface MapProps extends google.maps.MapOptions {
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
  ...options 
}: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  // Initialize the map
  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        ...options,
      });
      setMap(newMap);
    }
  }, [ref, map, options]);

  // Set up event listeners
  useEffect(() => {
    if (map) {
      ['click', 'idle'].forEach((eventName) => 
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener('click', onClick);
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map));
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
