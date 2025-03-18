import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Mock data for different categories
const recommendedForYou = [
  {
    id: '1',
    name: 'Pi Tech Hub',
    address: '123 Innovation Ave, San Francisco, CA',
    description: 'A technology store that specializes in gadgets and accepts Pi as payment.',
    rating: 4.8,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?q=80&w=2020&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Crypto Cafe',
    address: '456 Blockchain St, San Francisco, CA',
    description: 'A modern cafe with great coffee and pastries, proudly accepting Pi cryptocurrency.',
    rating: 4.5,
    category: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1978&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Pi Fashion Boutique',
    address: '789 Style Blvd, San Francisco, CA',
    description: 'Trendy clothing store with the latest fashions that accepts Pi payments.',
    rating: 4.6,
    category: 'Shopping',
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop'
  },
];

const suggestedForYou = [
  {
    id: '4',
    name: 'Pi Wellness Center',
    address: '101 Healthy Way, San Francisco, CA',
    description: 'Spa and wellness center offering services with Pi cryptocurrency payment options.',
    rating: 4.7,
    category: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '5',
    name: 'Pi Book Shop',
    address: '202 Reader Lane, San Francisco, CA',
    description: 'Independent bookstore with a wide selection of titles and Pi payment options.',
    rating: 4.4,
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1521056787327-239a23f27ebb?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '6',
    name: 'Pi Organic Market',
    address: '303 Green St, San Francisco, CA',
    description: 'Fresh organic produce and locally sourced goods available with Pi payments.',
    rating: 4.5,
    category: 'Grocery',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop'
  },
];

const avanteTopChoice = [
  {
    id: '7',
    name: 'Pi Computing',
    address: '404 Tech Blvd, San Francisco, CA',
    description: 'Premium computer and tech repair service that accepts Pi for all services.',
    rating: 4.9,
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '8',
    name: 'Pi Restaurant',
    address: '505 Culinary Ave, San Francisco, CA',
    description: 'Fine dining establishment with innovative cuisine and Pi payment options.',
    rating: 4.8,
    category: 'Food & Drink',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    id: '9',
    name: 'Pi Adventure Tours',
    address: '606 Explorer Way, San Francisco, CA',
    description: 'Guided tours and outdoor adventures that accept Pi cryptocurrency.',
    rating: 4.7,
    category: 'Travel',
    image: 'https://images.unsplash.com/photo-1533619242606-bb0a792f90a3?q=80&w=2070&auto=format&fit=crop'
  },
];

// Reusable place card component
const PlaceCard = ({ place }) => (
  <Card key={place.id} className="min-w-[250px] w-72 flex-shrink-0 overflow-hidden">
    <div className="h-40 overflow-hidden">
      <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
    </div>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <CardTitle className="text-lg">{place.name}</CardTitle>
        <div className="flex items-center bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
          <Star className="h-4 w-4 mr-1 inline fill-yellow-500 text-yellow-500" />
          {place.rating}
        </div>
      </div>
      <CardDescription className="flex items-start">
        <MapPin className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5 text-muted-foreground" />
        {place.address}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground line-clamp-2">{place.description}</p>
      <div className="mt-2">
        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
          {place.category}
        </span>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between pt-2">
      <Button variant="outline" size="sm">
        View on Map
      </Button>
      <Button variant="default" size="sm" className="bg-avante-blue hover:bg-avante-blue/90">
        <ExternalLink className="h-4 w-4 mr-2" />
        Directions
      </Button>
    </CardFooter>
  </Card>
);

// Reusable category section component
const CategorySection = ({ title, places }) => (
  <div className="mb-10">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <ScrollArea className="w-full" orientation="horizontal">
      <div className="flex space-x-4 pb-4 px-1">
        {places.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>
    </ScrollArea>
  </div>
);

const Recommendations = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommended Pi-Accepting Businesses</h1>
          <p className="text-muted-foreground mt-2">Discover top-rated places that accept Pi cryptocurrency as payment.</p>
        </div>

        <CategorySection title="Recommended for you" places={recommendedForYou} />
        <CategorySection title="Suggested for you" places={suggestedForYou} />
        <CategorySection title="Avante Top Choice" places={avanteTopChoice} />
      </div>
    </AppLayout>
  );
};

export default Recommendations;
