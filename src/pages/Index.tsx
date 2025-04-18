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
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation();
  const mapRef = useRef<HTMLDivElement>(null);
  const detailCardRef = useRef<HTMLDivElement>(null);
  
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
        
        const transformedPlaces: Place[] = data.map((business, index) => {
          let position = { lat: 37.7749 + (Math.random() * 0.2 - 0.1), lng: -122.4194 + (Math.random() * 0.2 - 0.1) };
          
          try {
          } catch (e) {
            console.error("Failed to parse location:", e);
          }
          
          return {
            id: business.id.toString(),
            name: business.name,
            position: position,
            address: business.location || "No address provided",
            rating: 4.5,
            totalReviews: 0,
            description: business.description || "No description provided",
            category: business.category || "Other",
            image: "/placeholder.svg",
            website: "",
            phone: "",
            hours: {},
            isVerified: true,
          };
        });
        
        setPlaces(transformedPlaces);
        setFilteredPlaces(transformedPlaces);
      } catch (error) {
        console.error('Error fetching businesses:', error);
        toast.error('Failed to load businesses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBusinesses();
  }, []);

  useEffect(() => {
    if (location.state && location.state.selectedPlaceId) {
      setSelectedPlace(location.state.selectedPlaceId);
    }
  }, [location.state]);

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    
    if (!searchTerm.trim()) {
      setFilteredPlaces(places);
      return;
    }
    
    const normalizedSearch = searchTerm.toLowerCase();
    
    const filtered = places.filter(place => {
      const basicMatch = place.name.toLowerCase().includes(normalizedSearch) ||
        place.address.toLowerCase().includes(normalizedSearch) ||
        place.category.toLowerCase().includes(normalizedSearch) ||
        place.description.toLowerCase().includes(normalizedSearch);

      const typeMatch = place.business_types?.some(type => 
        type.toLowerCase().includes(normalizedSearch)
      );

      const keywordMatch = place.keywords?.some(keyword =>
        keyword.toLowerCase().includes(normalizedSearch)
      );

      return basicMatch || typeMatch || keywordMatch;
    });
    
    setFilteredPlaces(filtered);
    
    if (filtered.length === 0) {
      toast.info("No businesses found. Try a different name, address, or keyword.");
    }
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
          places={filteredPlaces} 
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
