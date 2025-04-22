
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Place } from '@/data/mockPlaces';
import { toast } from 'sonner';

interface SupabaseBusiness {
  id: number;
  name: string;
  owner_id: string;
  created_at: string;
  contact_info: any;
  hours: any;
  coordinates: string;
  business_types: string[];
  pi_wallet_address: string;
  keywords: string[];
  description: string;
  location: string;
  category: string;
}

export const useBusinessData = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('*');
        
        if (error) throw error;
        
        const transformedPlaces: Place[] = (data as SupabaseBusiness[]).map((business) => {
          let position = { lat: 37.7749 + (Math.random() * 0.2 - 0.1), lng: -122.4194 + (Math.random() * 0.2 - 0.1) };
          
          try {
            if (business.coordinates) {
              const coordinates = JSON.parse(business.coordinates);
              if (coordinates.lat && coordinates.lng) {
                position = coordinates;
              }
            }
          } catch (e) {
            console.error("Failed to parse location:", e);
          }
          
          const contactInfo = typeof business.contact_info === 'object' ? business.contact_info : {};
          const website = contactInfo?.website || "";
          const phone = contactInfo?.phone || "";

          const hoursRecord: Record<string, string> = {};
          if (typeof business.hours === 'object' && business.hours !== null) {
            Object.entries(business.hours).forEach(([day, time]) => {
              hoursRecord[day] = String(time);
            });
          }
          
          return {
            id: business.id.toString(),
            name: business.name,
            position,
            address: business.location || "No address provided",
            rating: 4.5,
            totalReviews: 0,
            description: business.description || "No description provided",
            category: business.category || "Other",
            image: "/placeholder.svg",
            website,
            phone,
            hours: hoursRecord,
            isVerified: false,
            business_types: business.business_types || [],
            keywords: business.keywords || [],
            isUserBusiness: business.owner_id === business.owner_id || false,
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

  const handleSearch = (searchTerm: string) => {    
    if (!searchTerm.trim()) {
      setFilteredPlaces(places);
      return;
    }
    
    const normalizedSearch = searchTerm.toLowerCase();
    
    const filtered = places.filter(place => {
      const nameMatch = place.name?.toLowerCase().includes(normalizedSearch);
      const addressMatch = place.address?.toLowerCase().includes(normalizedSearch);
      const categoryMatch = place.category?.toLowerCase().includes(normalizedSearch);
      const typeMatch = place.business_types?.some(type => 
        type?.toLowerCase().includes(normalizedSearch)
      );
      const keywordMatch = place.keywords?.some(keyword =>
        keyword?.toLowerCase().includes(normalizedSearch)
      );
      
      const businessTypeMatch = Array.isArray(place.business_types)
        ? place.business_types.some(type => type?.toLowerCase().includes(normalizedSearch))
        : false;

      return nameMatch || addressMatch || categoryMatch || typeMatch || keywordMatch || businessTypeMatch;
    });
    
    setFilteredPlaces(filtered);
    
    if (filtered.length === 0) {
      toast.info("No businesses found. Try a different name, address, or keyword.");
    }
  };

  return {
    places,
    filteredPlaces,
    isLoading,
    handleSearch
  };
};
