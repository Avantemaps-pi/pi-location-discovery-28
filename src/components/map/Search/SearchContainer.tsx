import React from 'react';
import SearchBar from '@/components/map/SearchBar';
interface SearchContainerProps {
  onSearch: (searchTerm: string) => void;
}
const SearchContainer: React.FC<SearchContainerProps> = ({
  onSearch
}) => {
  return <div className="absolute top-2 left-12 right-0 z-10 px-4">
      <div className="max-w-md mx-auto">
        <SearchBar onSearch={onSearch} placeholders={["Search for Address", "Search for Business name", "Search for Business Type", "Search for Keywords"]} cycleInterval={3000} />
      </div>
    </div>;
};
export default SearchContainer;