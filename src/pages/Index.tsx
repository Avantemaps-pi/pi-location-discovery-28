
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import GoogleMap from '@/components/map/GoogleMap';
import SearchBar from '@/components/map/SearchBar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Place } from '@/data/mockPlaces';
import { toast } from 'sonner';

const Index = () => {
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);
  
  // Fetch businesses from Supabase
  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        // Transform the businesses data to match the Place interface
        const transformedPlaces: Place[] = data.map((business, index) => {
          // Extract lat/lng from location string or use default coordinates if parsing fails
          let position = { lat: 37.7749 + (Math.random() * 0.2 - 0.1), lng: -122.4194 + (Math.random() * 0.2 - 0.1) };
          
          try {
            // In a real implementation, you would store actual coordinates or geocode the address
            // This is a simplified example using random coordinates near San Francisco
            // You can replace this with actual geocoding logic
          } catch (e) {
            console.error("Failed to parse location:", e);
          }
          
          return {
            id: business.id.toString(),
            name: business.name,
            position: position,
            address: business.location || "No address provided",
            rating: 4.5, // Default rating
            totalReviews: 0, // Default reviews
            description: business.description || "No description provided",
            category: business.category || "Other",
            image: "/placeholder.svg", // Default image
            website: "",
            phone: "",
            hours: {},
            isVerified: true,
          };
        });
        
        setPlaces(transformedPlaces);
      } catch (error) {
        console.error('Error fetching businesses:', error);
        toast.error('Failed to load businesses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinesses();
  }, []);

  // Handle location.state if it contains selectedPlaceId
  useEffect(() => {
    if (location.state && location.state.selectedPlaceId) {
      setSelectedPlace(location.state.selectedPlaceId);
    }
  }, [location.state]);

  const handleSearch = (searchTerm: string) => {
    console.log('Search for:', searchTerm);
  };
  
  const handlePlaceClick = (placeId: string) => {
    setSelectedPlace(placeId === "" ? null : placeId);
  };

  return (
    <AppLayout 
      title="Avante Maps" 
      withHeader={true} 
      fullHeight={true} 
      fullWidth={true}
      hideSidebar={false}
    >
      <div className="absolute inset-0 top-16 w-full" ref={mapRef}>
        <GoogleMap 
          places={places} 
          selectedPlaceId={selectedPlace} 
          onMarkerClick={handlePlaceClick}
          detailCardRef={detailCardRef}
          isLoading={isLoading}
        />
        
        <div className="absolute top-4 left-0 right-0 z-10 px-4">
          <div className="max-w-md mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholders={["Search for Address", "Search for Business name", "Search for Keywords"]}
              cycleInterval={3000}
            />
          </div>
        </div>
        
        <div className={`absolute bottom-6 ${selectedPlace ? 'right-16 md:right-[calc(50%+200px)]' : 'right-6'} z-20 transition-all duration-300`}>
          <Link to="/registration">
            <Button 
              className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90 shadow-lg"
              aria-label="Register a business"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
