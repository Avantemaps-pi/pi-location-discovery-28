
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Compass, 
  Bookmark, 
  Mail, 
  Info, 
  Settings,
  FileText,
  PiSquare,
  Clipboard,
  LogIn,
  Menu,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ to, icon: Icon, label, isActive, onClick }: NavItemProps) => (
  <li>
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  </li>
);

interface AppSidebarProps {
  className?: string;
  isSheet?: boolean;
  onClose?: () => void;
}

const AppSidebar = ({ className, isSheet = false, onClose }: AppSidebarProps) => {
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/recommendations', icon: Compass, label: 'Recommendations' },
    { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { to: '/registration', icon: Clipboard, label: 'Register Business' },
    { to: '/contact', icon: Mail, label: 'Contact' },
    { to: '/about', icon: Info, label: 'About Us' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const legalItems = [
    { to: '/terms', icon: FileText, label: 'Terms of Service' },
    { to: '/privacy', icon: FileText, label: 'Privacy Policy' },
    { to: '/cookies', icon: FileText, label: 'Cookie Policy' },
  ];

  const handleLinkClick = () => {
    if (isSheet && onClose) {
      onClose();
    }
    setIsMobileOpen(false);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  // Mobile sidebar trigger
  const MobileTrigger = () => (
    <div className="md:hidden fixed z-30 bottom-6 left-6">
      <Button 
        onClick={toggleMobileSidebar} 
        size="icon"
        className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/80"
      >
        {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
    </div>
  );

  return (
    <>
      <MobileTrigger />
      
      <aside 
        className={cn(
          "flex-col bg-sidebar shadow-lg h-full transition-transform duration-300",
          isSheet ? "flex w-full" : "fixed inset-y-0 left-0 z-20 w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          className
        )}
      >
        {/* Logo section */}
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2" onClick={handleLinkClick}>
            <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-2 rounded-md">
              <PiSquare className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-avante-blue to-avante-purple bg-clip-text text-transparent">
                Avante Maps
              </span>
              <span className="text-xs text-muted-foreground">Pi Payment Finder</span>
            </div>
          </Link>
          <DarkModeToggle />
        </div>
        
        {/* Login button */}
        <div className="p-4 border-b border-sidebar-border">
          <Button className="w-full flex items-center gap-2" variant="outline">
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8">
          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.to}
                  onClick={handleLinkClick}
                />
              ))}
            </ul>
          </nav>

          {/* Legal links */}
          <div>
            <h3 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-3">Legal</h3>
            <ul className="space-y-1">
              {legalItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={location.pathname === item.to}
                  onClick={handleLinkClick}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p>© 2023 Avante Maps</p>
          <p>Powered by Pi Network</p>
          <div className="mt-2 flex items-center">
            <PiSquare className="h-4 w-4 mr-1 text-avante-purple" />
            <span>Find Pi-enabled businesses near you</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
