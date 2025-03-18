
import React, { useState } from 'react';
import GoogleMap from '@/components/map/GoogleMap';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/recommendations', label: 'Recommendations' },
    { to: '/bookmarks', label: 'Bookmarks' },
    { to: '/contact', label: 'Contact' },
    { to: '/about', label: 'About Us' },
    { to: '/settings', label: 'Settings' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/cookies', label: 'Cookie Policy' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search for:', searchTerm);
    // Implement search functionality here
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="h-16 border-b flex items-center px-4 bg-white">
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-auto">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="py-4">
              <div className="px-4 py-2 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
              </div>
              <nav className="mt-4">
                <ul className="space-y-2 px-2">
                  {navItems.map((item) => (
                    <li key={item.to}>
                      <Link 
                        to={item.to} 
                        className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-slate-100"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex-1 flex justify-center">
          <h1 className="text-xl font-bold">Avante Maps</h1>
        </div>
        
        <div className="w-10">
          {/* Empty div to balance the header */}
        </div>
      </header>
      
      {/* Search box below header */}
      <div className="w-full px-4 py-2 border-b bg-white">
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
      
      {/* Content area */}
      <div className="flex-1 overflow-auto">
        {/* The page is empty except for the header with burger menu and search box */}
      </div>
    </div>
  );
};

export default Index;
