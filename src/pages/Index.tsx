import React, { useState } from 'react';
import GoogleMap from '@/components/map/GoogleMap';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
                  <li>
                    <a href="/" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-slate-100">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="/about" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-slate-100">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/contact" className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-slate-100">
                      Contact
                    </a>
                  </li>
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
      
      {/* Content area - currently empty as per request */}
      <div className="flex-1">
        {/* The page is empty except for the header with burger menu */}
      </div>
    </div>
  );
};

export default Index;
