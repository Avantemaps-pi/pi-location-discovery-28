
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchTerm);
    // Implement search functionality here
  };

  return (
    <AppLayout title="Avante Maps" withHeader={true}>
      {/* Search box */}
      <div className="w-full pb-4">
        <form onSubmit={handleSearch} className="max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>
      
      {/* Content area can be empty as requested */}
      <div className="flex-1">
        {/* The page is empty except for the header with burger menu and search box */}
      </div>
    </AppLayout>
  );
};

export default Index;
