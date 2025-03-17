
import React, { useRef, useEffect, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Loader2 } from 'lucide-react';

// Placeholder for Google Maps API key - this should be handled securely in production
const GOOGLE_MAPS_API_KEY = "YOUR_API_KEY_HERE";

// Map component that uses the Google Maps JavaScript API
interface MapProps extends google.maps.MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

// Define a proper interface for children components that need the map prop
interface MapChildProps {
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

// Marker component
interface MarkerProps extends google.maps.MarkerOptions {
  onClick?: () => void;
  map?: google.maps.Map;
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

// Loading spinner
const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full">
    <Loader2 className="h-12 w-12 text-avante-blue animate-spin" />
  </div>
);

// Error message
const ErrorMessage = () => (
  <div className="flex items-center justify-center w-full h-full bg-red-50">
    <div className="text-center p-4">
      <p className="text-red-600 text-lg font-semibold">Error loading Google Maps</p>
      <p className="text-red-500">Please check your connection and try again</p>
    </div>
  </div>
);

// Example for demo data - in a real app, this would come from your MongoDB database
const exampleLocations = [
  { id: 1, position: { lat: 37.7749, lng: -122.4194 }, title: "San Francisco Pi Cafe" },
  { id: 2, position: { lat: 37.7833, lng: -122.4167 }, title: "Pi Tech Store" },
  { id: 3, position: { lat: 37.7694, lng: -122.4862 }, title: "Pi Gadgets" },
  { id: 4, position: { lat: 37.7583, lng: -122.4267 }, title: "Pi Bakery" },
];

// Render state based on status
const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <LoadingSpinner />;
    case Status.FAILURE:
      return <ErrorMessage />;
    default:
      return <LoadingSpinner />;
  }
};

// Main Google Map component with wrapper
const GoogleMap: React.FC = () => {
  const [zoom, setZoom] = useState(13);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 37.7749,
    lng: -122.4194,
  });
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const handleMarkerClick = (id: number) => {
    setActiveMarker(id);
    // In a real app, you would show details about the location here
    console.log(`Clicked on marker ${id}`);
  };

  return (
    <div className="w-full h-full">
      <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
        <MapComponent
          center={center}
          zoom={zoom}
          minZoom={3}
          maxZoom={18}
          mapId="avante_map_id"
          onIdle={(map) => {
            setZoom(map.getZoom() || 13);
            setCenter(map.getCenter()?.toJSON() || center);
          }}
          mapTypeControl={false}
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={true}
          styles={[
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]}
        >
          {exampleLocations.map(({ id, position, title }) => (
            <Marker
              key={id}
              position={position}
              title={title}
              icon={{
                url: `data:image/svg+xml,
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="%238B5CF6" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                  </svg>`,
                scaledSize: new google.maps.Size(36, 36),
              }}
              onClick={() => handleMarkerClick(id)}
              animation={activeMarker === id ? google.maps.Animation.BOUNCE : undefined}
            />
          ))}
        </MapComponent>
      </Wrapper>
    </div>
  );
};

export default GoogleMap;
