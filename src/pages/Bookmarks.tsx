
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

// Mock data for bookmarks - in a real app, this would come from user data
const bookmarkedPlaces = [
  {
    id: '1',
    name: 'Pi Cafe Downtown',
    address: '123 Main St, San Francisco, CA',
    category: 'Cafe',
    dateAdded: '2023-06-15',
  },
  {
    id: '2',
    name: 'Pi Tech Store',
    address: '456 Market St, San Francisco, CA',
    category: 'Technology',
    dateAdded: '2023-07-20',
  },
  {
    id: '3',
    name: 'Pi Bakery',
    address: '789 Mission St, San Francisco, CA',
    category: 'Food',
    dateAdded: '2023-08-05',
  },
];

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = React.useState(bookmarkedPlaces);

  const removeBookmark = (id: string) => {
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
          <div className="space-y-4">
            {bookmarks.map((place) => (
              <Card key={place.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{place.name}</CardTitle>
                      <div className="flex items-center mt-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {place.address}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {place.category}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Bookmarked on: {new Date(place.dateAdded).toLocaleDateString()}
                  </div>
                </CardContent>
                <Separator />
                <CardFooter className="flex justify-between pt-3 pb-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeBookmark(place.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      View on Map
                    </Button>
                    <Button variant="default" size="sm" className="bg-avante-blue hover:bg-avante-blue/90">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Bookmarks;
