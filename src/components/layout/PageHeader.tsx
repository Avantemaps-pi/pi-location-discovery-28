
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { Home, Compass, Bookmark, Mail, Info, Settings, FileText, PiSquare, Clipboard } from 'lucide-react';

interface PageHeaderProps {
  title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = "Avante Maps" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/recommendations', label: 'Recommendations', icon: Compass },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/registration', label: 'Register Business', icon: Clipboard },
    { to: '/contact', label: 'Contact', icon: Mail },
    { to: '/about', label: 'About Us', icon: Info },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  const legalItems = [
    { to: '/terms', label: 'Terms of Service', icon: FileText },
    { to: '/privacy', label: 'Privacy Policy', icon: FileText },
    { to: '/cookies', label: 'Cookie Policy', icon: FileText },
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
        <SheetContent side="left" className="p-0 w-64 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="py-4">
              <div className="px-4 py-2 border-b">
                <Link to="/" onClick={() => setIsSidebarOpen(false)} className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-2 rounded-md">
                    <PiSquare className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-avante-blue to-avante-purple bg-clip-text text-transparent">Avante Maps</h2>
                </Link>
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
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="mt-6 px-4">
                <h3 className="text-xs uppercase text-muted-foreground font-medium mb-2">Legal</h3>
                <ul className="space-y-2">
                  {legalItems.map((item) => (
                    <li key={item.to}>
                      <Link 
                        to={item.to} 
                        className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-slate-100"
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* Footer section */}
          <div className="mt-auto p-4 border-t text-xs text-muted-foreground">
            <p>© 2023 Avante Maps</p>
            <p>Powered by Pi Network</p>
            <div className="mt-2 flex items-center">
              <PiSquare className="h-4 w-4 mr-1 text-avante-purple" />
              <span>Find Pi-enabled businesses near you</span>
            </div>
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
