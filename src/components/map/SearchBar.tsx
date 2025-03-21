
import React, { useState } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchResult {
  id: string;
  name: string;
  address: string;
  acceptsPi: boolean;
}

// Mock search results for demonstration
const mockResults: SearchResult[] = [
  { id: '1', name: 'Pi Cafe Downtown', address: '123 Main St, San Francisco', acceptsPi: true },
  { id: '2', name: 'Pi Tech Store', address: '456 Market St, San Francisco', acceptsPi: true },
  { id: '3', name: 'Pi Bakery', address: '789 Mission St, San Francisco', acceptsPi: true },
  { id: '4', name: 'Pi Gadgets', address: '101 Howard St, San Francisco', acceptsPi: true },
];

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isResultsOpen, setIsResultsOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter mock results (in a real app, this would be a database query)
      const filteredResults = searchTerm.trim() === '' 
        ? [] 
        : mockResults.filter(
            result => 
              result.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              result.address.toLowerCase().includes(searchTerm.toLowerCase())
          );
          
      setResults(filteredResults);
      setIsResultsOpen(true);
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setIsResultsOpen(false);
  };

  const handleResultClick = (result: SearchResult) => {
    console.log('Selected result:', result);
    // In a real app, you would handle this event, e.g., by navigating to the location on the map
    setIsResultsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Keywords..."
            className="pl-10 pr-10 py-6 bg-white shadow-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => results.length > 0 && setIsResultsOpen(true)}
          />
          {searchTerm && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-6 w-6 p-0"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button 
          type="submit" 
          className="absolute right-2 top-2 sr-only"
          disabled={isSearching}
        >
          Search
        </Button>
      </form>

      {/* Search Results */}
      {isResultsOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg overflow-hidden z-10 max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="p-2 hover:bg-muted rounded-md cursor-pointer transition-colors"
                onClick={() => handleResultClick(result)}
              >
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-avante-purple flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{result.name}</p>
                    <p className="text-sm text-muted-foreground">{result.address}</p>
                  </div>
                </div>
                <div className="ml-7 mt-1">
                  <span className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium",
                    "bg-green-100 text-green-800"
                  )}>
                    Accepts Pi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isResultsOpen && results.length === 0 && searchTerm.trim() !== '' && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-md shadow-lg z-10">
          <div className="p-4 text-center">
            <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
