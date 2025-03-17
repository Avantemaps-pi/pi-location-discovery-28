
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Star, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for recommendations
const recommendedPlaces = [
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
  {
    id: '4',
    name: 'Pi Wellness Center',
    address: '101 Healthy Way, San Francisco, CA',
    description: 'Spa and wellness center offering services with Pi cryptocurrency payment options.',
    rating: 4.7,
    category: 'Health & Wellness',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop'
  },
];

const Recommendations = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recommended Pi-Accepting Businesses</h1>
          <p className="text-muted-foreground mt-2">Discover top-rated places that accept Pi cryptocurrency as payment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedPlaces.map((place) => (
            <Card key={place.id} className="overflow-hidden">
              <div className="h-48 overflow-hidden">
                <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform hover:scale-105 duration-300" />
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{place.name}</CardTitle>
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
                <p className="text-sm text-muted-foreground">{place.description}</p>
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
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Recommendations;
