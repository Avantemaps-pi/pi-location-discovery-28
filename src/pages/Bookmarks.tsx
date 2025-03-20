
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PlaceCard from '@/components/business/PlaceCard';
import { useNavigate } from 'react-router-dom';
import { Place } from '@/data/mockPlaces';

const bookmarkedPlaces: Place[] = [
  {
    id: '1',
    name: 'Pi Cafe Downtown',
    address: '123 Main St, San Francisco, CA',
    category: 'Cafe',
    dateAdded: '2023-06-15',
    description: 'A cozy cafe that accepts Pi payments for coffee, pastries and light meals. Great atmosphere for working or meeting friends.',
    image: '/placeholder.svg',
    rating: 4.5,
    position: { lat: 37.773, lng: -122.413 }
  },
  {
    id: '2',
    name: 'Pi Tech Store',
    address: '456 Market St, San Francisco, CA',
    category: 'Technology',
    dateAdded: '2023-07-20',
    description: 'Electronics and gadgets store that accepts Pi cryptocurrency. Offers repairs and accessories for all major brands.',
    image: '/placeholder.svg',
    rating: 4.2,
    position: { lat: 37.789, lng: -122.401 }
  },
  {
    id: '3',
    name: 'Pi Bakery',
    address: '789 Mission St, San Francisco, CA',
    category: 'Food',
    dateAdded: '2023-08-05',
    description: 'Artisanal bakery with fresh bread, pastries and cakes. Uses local ingredients and accepts Pi for all purchases.',
    image: '/placeholder.svg',
    rating: 4.7,
    position: { lat: 37.785, lng: -122.405 }
  },
];

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = React.useState(bookmarkedPlaces);
  const navigate = useNavigate();

  const removeBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const handlePlaceClick = (placeId: string) => {
    console.log(`Clicked on place: ${placeId}`);
    navigate('/recommendations', { state: { selectedPlaceId: placeId } });
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Bookmarks</h1>
          <p className="text-muted-foreground mt-2">Your saved Pi-accepting businesses.</p>
        </div>

        {bookmarks.length === 0 ? (
          <Card className="w-full py-8">
            <CardContent className="text-center">
              <p className="text-muted-foreground">You don't have any bookmarked places yet.</p>
              <Button 
                className="mt-4"
                onClick={() => navigate('/recommendations')}
              >
                Explore Map
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((place) => (
              <PlaceCard 
                key={place.id} 
                place={place} 
                onPlaceClick={handlePlaceClick}
                onRemove={removeBookmark} 
              />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Bookmarks;
