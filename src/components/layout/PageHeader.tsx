
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, LogIn, ChevronLeft } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, Mail, Info, Settings, FileText, PiSquare, Clipboard, UserPlus, User, Bell, Building } from 'lucide-react';
import LoginDialog from '@/components/auth/LoginDialog';
import { Badge } from '@/components/ui/badge';
import { getUnreadNotificationsCount, notificationUpdateEvent } from '@/utils/notificationUtils'; 

interface PageHeaderProps {
  title?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title = "Avante Maps" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(getUnreadNotificationsCount());
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on the Analytics or Review page to hide the burger menu
  const isAnalyticsPage = location.pathname === '/analytics';
  const isReviewPage = location.pathname.includes('/review');
  const hideMenu = isAnalyticsPage || isReviewPage;
  
  // Update the unread count when notifications change
  useEffect(() => {
    const handleNotificationUpdate = () => {
      setUnreadNotifications(getUnreadNotificationsCount());
    };

    // Listen for notification updates
    window.addEventListener('notificationUpdate', handleNotificationUpdate);

    return () => {
      window.removeEventListener('notificationUpdate', handleNotificationUpdate);
    };
  }, []);

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/recommendations', label: 'Recommendations', icon: Compass },
    { to: '/bookmarks', label: 'Bookmarks', icon: Bookmark },
    { to: '/communicon', label: 'Communicon', icon: User },
    { 
      to: '/notifications', 
      label: 'Notifications', 
      icon: Bell,
      hasNotifications: unreadNotifications > 0,
      notificationCount: unreadNotifications
    },
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

  const handleTitleClick = () => {
    navigate('/');
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <header className="h-16 border-b flex items-center px-4 bg-white">
      {!hideMenu ? (
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
                          className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-slate-100 relative"
                          onClick={() => setIsSidebarOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.label}
                          {item.hasNotifications && (
                            <Badge 
                              className="absolute right-2 bg-red-500 text-white ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full"
                            >
                              {item.notificationCount}
                            </Badge>
                          )}
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
              <Link to="/about" onClick={() => setIsSidebarOpen(false)} className="text-slate-500 mt-1 hover:text-slate-700 transition-colors">
                Architectured by Avante Labs
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-auto"
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
      )}
      
      <div className={`flex-1 flex justify-center ${hideMenu ? 'ml-0' : ''}`}>
        <h1 
          className="text-xl font-bold cursor-pointer hover:text-blue-500 transition-colors"
          onClick={handleTitleClick}
        >
          {title}
        </h1>
      </div>
      
      <div className="w-10">
        {/* Empty div to balance the header */}
      </div>

      <LoginDialog open={isLoginDialogOpen} onOpenChange={setIsLoginDialogOpen} />
    </header>
  );
};

export default PageHeader;
