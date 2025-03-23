
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
  styles?: google.maps.MapTypeStyle[];
}

// Map component that uses the Google Maps JavaScript API
interface MapProps extends MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode | ((map: google.maps.Map | undefined) => React.ReactNode);
  myLocationEnabled?: boolean;
  myLocationButtonEnabled?: boolean;
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
  myLocationEnabled = true,
  myLocationButtonEnabled = true,
  ...options 
}: MapProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  // Initialize the map
  useEffect(() => {
    if (ref.current && !map && window.google) {
      // Remove mapId from options if we're using styles
      // This prevents the conflict between mapId and styles
      const mapOptions = { ...options };
      if (mapOptions.styles && mapOptions.styles.length > 0) {
        delete mapOptions.mapId;
      }

      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        ...mapOptions,
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

  // Handle location settings - we'll implement this with proper type checking
  useEffect(() => {
    if (map) {
      try {
        // Using setOptions with location properties
        // @ts-ignore - Google Maps types don't include these properties but they work at runtime
        map.setOptions({
          myLocationEnabled,
          myLocationButtonEnabled
        });
      } catch (error) {
        console.warn('Could not set location options:', error);
      }
    }
  }, [map, myLocationEnabled, myLocationButtonEnabled]);

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
      {map && typeof children === 'function' 
        ? children(map)
        : React.Children.map(children as React.ReactNode, (child) => {
            if (React.isValidElement(child)) {
              // Type assertion to allow passing the map prop to children
              return React.cloneElement(child as React.ReactElement<MapChildProps>, { map });
            }
            return child;
          })
      }
    </>
  );
};

export default MapComponent;
