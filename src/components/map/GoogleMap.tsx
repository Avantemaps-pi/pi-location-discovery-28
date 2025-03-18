
import React, { useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from './MapComponent';
import Marker from './Marker';
import { renderMap } from './MapLoadingStates';
import { GOOGLE_MAPS_API_KEY, exampleLocations, mapStyles, defaultCenter, defaultZoom } from './mapConfig';

// Main Google Map component with wrapper
const GoogleMap: React.FC = () => {
  const [zoom, setZoom] = useState(defaultZoom);
  const [center, setCenter] = useState(defaultCenter);
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const handleMarkerClick = (id: number) => {
    setActiveMarker(id);
    // In a real app, you would show details about the location here
    console.log(`Clicked on marker ${id}`);
  };

  return (
    <div className="w-full h-full">
      <Wrapper 
        apiKey={GOOGLE_MAPS_API_KEY} 
        render={renderMap}
        libraries={['places']}
      >
        <MapComponent
          center={center}
          zoom={zoom}
          minZoom={3}
          maxZoom={18}
          mapId="avante_map_id"
          onIdle={(map) => {
            setZoom(map.getZoom() || defaultZoom);
            const mapCenter = map.getCenter();
            if (mapCenter) {
              setCenter({ lat: mapCenter.lat(), lng: mapCenter.lng() });
            }
          }}
          mapTypeControl={false}
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={true}
          styles={mapStyles}
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
                scaledSize: { width: 36, height: 36 },
              }}
              onClick={() => handleMarkerClick(id)}
              animation={activeMarker === id ? 1 : undefined}
            />
          ))}
        </MapComponent>
      </Wrapper>
    </div>
  );
};

export default GoogleMap;
