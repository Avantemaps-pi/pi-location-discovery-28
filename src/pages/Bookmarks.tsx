
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink, Star, Bookmark, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const bookmarkedPlaces = [
  {
    id: '1',
    name: 'Pi Cafe Downtown',
    address: '123 Main St, San Francisco, CA',
    category: 'Cafe',
    dateAdded: '2023-06-15',
    description: 'A cozy cafe that accepts Pi payments for coffee, pastries and light meals. Great atmosphere for working or meeting friends.',
    image: '/placeholder.svg',
    rating: 4.5,
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
  },
];

const PlaceCard = ({ place, onRemove }) => {
  const [isBookmarked, setIsBookmarked] = useState(true);
  
  const handleBookmarkToggle = () => {
    setIsBookmarked(!isBookmarked);
    if (!isBookmarked === false) {
      onRemove(place.id);
    }
  };
  
  return (
    <Card key={place.id} className="min-w-[250px] w-full flex-shrink-0 shadow-md border-gray-200">
      <CardHeader className="pb-2 px-3 pt-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <CircleCheck className="h-5 w-5 text-blue-500" />
            </div>
            <CardTitle className="text-base font-bold">{place.name}</CardTitle>
          </div>
          <Bookmark 
            className={`h-5 w-5 cursor-pointer ${isBookmarked ? 'text-blue-500 fill-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={handleBookmarkToggle}
          />
        </div>
      </CardHeader>
      
      <div className="h-40 overflow-hidden px-3">
        <div className="bg-gray-100 h-full flex items-center justify-center rounded-md">
          <img 
            src={place.image} 
            alt={place.name} 
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>
      
      <CardContent className="pt-3 px-3">
        <div className="flex items-center mb-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {place.address}
        </div>
        <p className="text-sm text-gray-700 line-clamp-4 h-20 mb-2">{place.description}</p>
        <div className="flex justify-between items-end mt-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(place.rating) 
                      ? 'text-yellow-400 fill-yellow-400' 
                      : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{place.rating.toFixed(1)}</span>
            </div>
            <Badge className="text-xs px-3 py-0.5 h-6 bg-purple-100 text-purple-800 hover:bg-purple-200 rounded-md border-0">{place.category}</Badge>
          </div>
          <div>
            <Button 
              variant="default" 
              size="sm" 
              className="bg-green-500 hover:bg-green-600 text-xs font-medium"
            >
              Website
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end pt-0 pb-3 px-3">
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0 text-xs h-auto">
          Details...
        </Button>
      </CardFooter>
    </Card>
  );
};

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = React.useState(bookmarkedPlaces);

  const removeBookmark = (id) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
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
              <Button className="mt-4">Explore Map</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((place) => (
              <PlaceCard key={place.id} place={place} onRemove={removeBookmark} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Bookmarks;
