import { v4 as uuidv4 } from 'uuid';

export interface Place {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  location?: {
    lat: number;
    lng: number;
  };
  address: string;
  rating: number;
  totalReviews?: number;
  description?: string;
  category: string;
  image?: string;
  isVerified?: boolean;
  isUserBusiness?: boolean;
  website?: string;
  phone?: string;
  hours?: Record<string, string>;
  business_types?: string[];
  keywords?: string[];
}

// Default locations for San Francisco
export const defaultLocations: Place[] = [
  {
    id: uuidv4(),
    name: "Golden Gate Park",
    position: { lat: 37.7694, lng: -122.4862 },
    address: "501 Stanyan St, San Francisco, CA 94117",
    rating: 4.8,
    totalReviews: 24586,
    description: "Sprawling urban park with gardens, museums & more.",
    category: "Park",
    image: "/placeholder.svg",
    website: "https://goldengatepark.com",
    isVerified: true
  },
  {
    id: uuidv4(),
    name: "Lombard Street",
    position: { lat: 37.8022, lng: -122.4186 },
    address: "1070 Lombard St, San Francisco, CA 94109",
    rating: 4.5,
    totalReviews: 15322,
    description: "Known as the 'most crooked street in the world'.",
    category: "Attraction",
    image: "/placeholder.svg",
    website: "https://www.sanfrancisco.travel/article/crookedest-street-lombard-street",
    isVerified: true
  },
  {
    id: uuidv4(),
    name: "Fisherman's Wharf",
    position: { lat: 37.8080, lng: -122.4170 },
    address: "Fisherman's Wharf, San Francisco, CA",
    rating: 4.3,
    totalReviews: 18987,
    description: "Popular tourist hub with seafood restaurants & sea lions.",
    category: "Attraction",
    image: "/placeholder.svg",
    website: "https://www.fishermanswharf.org",
    isVerified: true
  },
  {
    id: uuidv4(),
    name: "Ferry Building Marketplace",
    position: { lat: 37.7955, lng: -122.3937 },
    address: "1 Ferry Building, San Francisco, CA 94105",
    rating: 4.7,
    totalReviews: 12451,
    description: "Gourmet marketplace with local produce & artisan foods.",
    category: "Market",
    image: "/placeholder.svg",
    website: "https://www.ferrybuildingmarketplace.com",
    isVerified: true
  },
  {
    id: uuidv4(),
    name: "Alcatraz Island",
    position: { lat: 37.8267, lng: -122.4233 },
    address: "Alcatraz Island, San Francisco, CA 94133",
    rating: 4.6,
    totalReviews: 21345,
    description: "Infamous former prison accessible by ferry.",
    category: "Historical Site",
    image: "/placeholder.svg",
    website: "https://www.nps.gov/alca/index.htm",
    isVerified: true
  }
];

// Function to generate more mock places if needed
export const generateMockPlaces = (count: number = 10): Place[] => {
  const mockPlaces: Place[] = [];
  for (let i = 0; i < count; i++) {
    mockPlaces.push({
      id: uuidv4(),
      name: `Mock Place ${i + 1}`,
      position: {
        lat: 37.7749 + (Math.random() * 0.2 - 0.1), // Random lat around SF
        lng: -122.4194 + (Math.random() * 0.2 - 0.1), // Random lng around SF
      },
      address: `${Math.floor(Math.random() * 1000)} Random St, San Francisco, CA`,
      rating: Math.random() * 5,
      totalReviews: Math.floor(Math.random() * 10000),
      description: `A randomly generated mock place number ${i + 1}.`,
      category: "Random",
      image: "/placeholder.svg",
      website: "https://example.com",
      isVerified: Math.random() > 0.5,
    });
  }
  return mockPlaces;
};

export default defaultLocations;
