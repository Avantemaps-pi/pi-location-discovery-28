
import React, { useState, useEffect } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import MapComponent from './MapComponent';
import Marker from './Marker';
import { renderMap } from './MapLoadingStates';
import { GOOGLE_MAPS_API_KEY } from './mapConfig';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Update the Place interface to include isUserBusiness property
interface Place {
  id: string;
  name: string;
  position: google.maps.LatLngLiteral;
  category: string;
  isUserBusiness?: boolean;
}

interface RecommendationsMapProps {
  places: Place[];
  selectedPlaceId: string | null;
  onMarkerClick: (placeId: string) => void;
  detailCardRef?: React.RefObject<HTMLDivElement>;
  newBusinessData?: any;
}

const RecommendationsMap: React.FC<RecommendationsMapProps> = ({ 
  places, 
  selectedPlaceId,
  onMarkerClick,
  detailCardRef,
  newBusinessData
}) => {
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({ lat: 37.7749, lng: -122.4194 });
  const [zoom, setZoom] = useState(13);
  const [userBusinesses, setUserBusinesses] = useState<Place[]>([]);
  
  // Fetch user businesses from Supabase
  useEffect(() => {
    const fetchUserBusinesses = async () => {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('id, name, category, coordinates')
          .not('coordinates', 'is', null);
        
        if (error) {
          console.error('Error fetching user businesses:', error);
          return;
        }
        
        if (!data) {
          console.error('No data returned from Supabase');
          return;
        }
        
        // Transform the data into the Place format
        const formattedBusinesses = data
          .filter(business => business.coordinates) // Filter out any without coordinates
          .map(business => {
            try {
              // Parse coordinates from JSON string
              const coords = JSON.parse(business.coordinates || '{}');
              return {
                id: business.id.toString(),
                name: business.name,
                category: business.category,
                position: coords,
                isUserBusiness: true
              };
            } catch (e) {
              console.error("Failed to parse coordinates for business:", business.id);
              return null;
            }
          })
          .filter(Boolean) as Place[]; // Filter out any nulls from parsing errors
        
        setUserBusinesses(formattedBusinesses);
      } catch (error) {
        console.error('Error processing user businesses:', error);
      }
    };
    
    fetchUserBusinesses();
  }, []);
  
  // Combine mock places with user businesses
  const allPlaces = [...places, ...userBusinesses];
  
  // Add new business if provided
  useEffect(() => {
    if (newBusinessData) {
      // Center the map on the new business
      if (newBusinessData.position) {
        setCenter(newBusinessData.position);
        setZoom(15);
      }
    }
  }, [newBusinessData]);

  // Find the selected place to center the map if needed
  useEffect(() => {
    if (selectedPlaceId) {
      const selectedPlace = allPlaces.find(place => place.id === selectedPlaceId);
      if (selectedPlace && selectedPlace.position) {
        setCenter(selectedPlace.position);
        setZoom(15); // Zoom in when a place is selected
        
        // Show a toast notification
        toast.info(`Viewing: ${selectedPlace.name}`, {
          description: selectedPlace.category,
          duration: 2000,
        });
      }
    }
  }, [selectedPlaceId, allPlaces]);

  const handleIdle = (map: google.maps.Map) => {
    setZoom(map.getZoom() || 13);
    const mapCenter = map.getCenter();
    if (mapCenter) {
      setCenter({ lat: mapCenter.lat(), lng: mapCenter.lng() });
    }
  };

  return (
    <div className="w-full h-full relative">
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
          onIdle={handleIdle}
          mapTypeControl={false}
          fullscreenControl={false}
          streetViewControl={false}
          zoomControl={true}
        >
          {allPlaces.map((place) => (
            <Marker
              key={place.id}
              position={place.position}
              title={place.name}
              icon={{
                url: `data:image/svg+xml,
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="${
                    place.id === selectedPlaceId 
                      ? '%23047857' 
                      : place.isUserBusiness 
                        ? '%23EF4444' // Red for user businesses
                        : '%238B5CF6'  // Default purple
                  }" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                  </svg>`,
                scaledSize: { width: 36, height: 36 },
              }}
              onClick={() => onMarkerClick(place.id)}
              animation={place.id === selectedPlaceId ? 1 : undefined}
            />
          ))}
          
          {/* If there's a new business being added, show it with a special marker */}
          {newBusinessData && newBusinessData.position && (
            <Marker
              position={newBusinessData.position}
              title={newBusinessData.name || "New Business"}
              icon={{
                url: `data:image/svg+xml,
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="%23059669" stroke="%23FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="10" r="3"/>
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                  </svg>`,
                scaledSize: { width: 40, height: 40 },
              }}
              onClick={() => {
                if (newBusinessData.id) {
                  onMarkerClick(newBusinessData.id.toString());
                }
              }}
              animation={2} // Bounce animation
            />
          )}
        </MapComponent>
      </Wrapper>
    </div>
  );
};

export default RecommendationsMap;
