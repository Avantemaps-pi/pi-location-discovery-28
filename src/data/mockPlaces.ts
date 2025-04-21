
export interface Place {
  id: string;
  name: string;
  position: {
    lat: number;
    lng: number;
  };
  address: string;
  rating?: number;
  totalReviews?: number;
  description?: string;
  category: string;
  image?: string;
  website?: string;
  phone?: string;
  hours?: Record<string, string>;
  isVerified?: boolean;
  business_types?: string[];
  keywords?: string[];
  isUserBusiness?: boolean;
}

// Mock data for different categories
export const recommendedForYou: Place[] = [
  {
    id: '1',
    name: 'Pi Tech Hub',
    address: '123 Innovation Ave, San Francisco, CA',
    description: 'A technology store that specializes in gadgets and accepts Pi as payment.',
    rating: 4.8,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop',
    website: 'https://pitechhub.com',
    position: { lat: 37.775, lng: -122.419 }
  },
  {
    id: '2',
    name: 'Crypto Cafe',
    address: '456 Blockchain St, San Francisco, CA',
    description: 'A modern cafe with great coffee and pastries, proudly accepting Pi cryptocurrency.',
    rating: 4.5,
    category: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1978&auto=format&fit=crop',
    website: 'https://cryptocafe.com',
    position: { lat: 37.785, lng: -122.421 }
  },
  {
    id: '3',
    name: 'Pi Fashion Boutique',
    address: '789 Style Blvd, San Francisco, CA',
    description: 'Trendy clothing store with the latest fashions that accepts Pi payments.',
    rating: 4.6,
    category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
    website: 'https://pifashion.com',
    position: { lat: 37.770, lng: -122.430 }
  },
];

export const suggestedForYou: Place[] = [
  {
    id: '4',
    name: 'Pi Wellness Center',
    address: '101 Healthy Way, San Francisco, CA',
    description: 'Spa and wellness center offering services with Pi cryptocurrency payment options.',
    rating: 4.7,
    category: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    website: 'https://piwellness.com',
    position: { lat: 37.760, lng: -122.415 }
  },
  {
    id: '5',
    name: 'Pi Book Shop',
    address: '202 Reader Lane, San Francisco, CA',
    description: 'Independent bookstore with a wide selection of titles and Pi payment options.',
    rating: 4.4,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1521056787327-239a23f27ebb?q=80&w=2070&auto=format&fit=crop',
    website: 'https://pibookshop.com',
    position: { lat: 37.790, lng: -122.410 }
  },
  {
    id: '6',
    name: 'Pi Organic Market',
    address: '303 Green St, San Francisco, CA',
    description: 'Fresh organic produce and locally sourced goods available with Pi payments.',
    rating: 4.5,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop',
    website: 'https://piorganicmarket.com',
    position: { lat: 37.780, lng: -122.425 }
  },
];

export const avanteTopChoice: Place[] = [
  {
    id: '7',
    name: 'Pi Computing',
    address: '404 Tech Blvd, San Francisco, CA',
    description: 'Premium computer and tech repair service that accepts Pi for all services.',
    rating: 4.9,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop',
    website: 'https://picomputing.com',
    position: { lat: 37.795, lng: -122.405 }
  },
  {
    id: '8',
    name: 'Pi Restaurant',
    address: '505 Culinary Ave, San Francisco, CA',
    description: 'Fine dining establishment with innovative cuisine and Pi payment options.',
    rating: 4.8,
    category: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop',
    website: 'https://pirestaurant.com',
    position: { lat: 37.765, lng: -122.420 }
  },
  {
    id: '9',
    name: 'Pi Adventure Tours',
    address: '606 Explorer Way, San Francisco, CA',
    description: 'Guided tours and outdoor adventures that accept Pi cryptocurrency.',
    rating: 4.7,
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1533619242606-bb0a792f90a3?q=80&w=2070&auto=format&fit=crop',
    website: 'https://piadventures.com',
    position: { lat: 37.755, lng: -122.435 }
  },
];

// Combine all places for the map
export const allPlaces: Place[] = [...recommendedForYou, ...suggestedForYou, ...avanteTopChoice];
