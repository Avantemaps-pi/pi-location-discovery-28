
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogIn } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { Home, Compass, Bookmark, Mail, Info, Settings, FileText, PiSquare, Clipboard, UserPlus, User, Bell, Building } from 'lucide-react';
import LoginDialog from '@/components/auth/LoginDialog';

interface PageHeaderProps {
  title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = "Avante Maps" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/recommendations', label: 'Recommendations', icon: Compass },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/communicon', label: 'Communicon', icon: User },
    { to: '/notifications', label: 'Notifications', icon: Bell },
    { to: '/registered-business', label: 'My Businesses', icon: Building },
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

  const handleLoginClick = () => {
    setIsSidebarOpen(false);
    setIsLoginDialogOpen(true);
  };

  return (
    <header className="h-16 border-b flex items-center px-4 bg-white">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-auto">
            <Menu className="h-9 w-9" />
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
              
              {/* Login button */}
              <div className="px-4 py-3 border-b">
                <Button 
                  className="w-full flex items-center gap-2" 
                  variant="outline"
                  onClick={handleLoginClick}
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Button>
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
          
          <div className="mt-auto p-4 border-t text-xs text-muted-foreground">
            <p>© 2023 Avante Maps</p>
            <p>Powered by Pi Network</p>
          </div>
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 flex justify-center">
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      
      <div className="w-10">
        {/* Empty div to balance the header */}
      </div>

      {/* Login Dialog */}
      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </header>
  );
};

export default PageHeader;
