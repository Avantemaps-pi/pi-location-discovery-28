
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = "Avante Maps" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/recommendations', label: 'Recommendations' },
    { to: '/bookmarks', label: 'Bookmarks' },
    { to: '/registration', label: 'Register Business' },
    { to: '/contact', label: 'Contact' },
    { to: '/about', label: 'About Us' },
    { to: '/settings', label: 'Settings' },
    { to: '/terms', label: 'Terms of Service' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/cookies', label: 'Cookie Policy' },
  ];

  return (
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
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <div className="w-10">
        {/* Empty div to balance the header */}
      </div>
    </header>
  );
};

export default PageHeader;
