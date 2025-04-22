
import React from 'react';
import SearchBar from '@/components/map/SearchBar';
import { Place } from '@/data/mockPlaces';

interface SearchContainerProps {
  onSearch: (searchTerm: string) => void;
}

const SearchContainer: React.FC<SearchContainerProps> = ({ onSearch }) => {
  return (
    <div className="absolute top-4 left-0 right-0 z-10 px-4">
      <div className="max-w-md mx-auto">
        <SearchBar 
          onSearch={onSearch}
          placeholders={[
            "Search for Address", 
            "Search for Business name", 
            "Search for Business Type", 
            "Search for Keywords"
          ]}
          cycleInterval={3000}
        />
      </div>
    </div>
  );
};

export default SearchContainer;
