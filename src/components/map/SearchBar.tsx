
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch?: (searchTerm: string) => void;
  placeholders?: string[];
  cycleInterval?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholders = ["Search for Address", "Search for Business name"],
  cycleInterval = 3000,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = useState(0);
  
  // Effect to cycle through placeholders
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPlaceholderIndex((prevIndex) => 
        (prevIndex + 1) % placeholders.length
      );
    }, cycleInterval);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [placeholders.length, cycleInterval]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
    console.log('Search for:', searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
      <Input
        type="text"
        placeholder={placeholders[currentPlaceholderIndex]}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full pl-10 h-12 shadow-md transition-all duration-300"
      />
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
    </form>
  );
};

export default SearchBar;
