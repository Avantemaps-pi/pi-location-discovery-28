
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
  Menu,
  X,
  PiSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  </li>
);

const AppSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/recommendations', icon: Compass, label: 'Recommendations' },
    { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { to: '/contact', icon: Mail, label: 'Contact' },
    { to: '/about', icon: Info, label: 'About Us' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const legalItems = [
    { to: '/terms', icon: FileText, label: 'Terms of Service' },
    { to: '/privacy', icon: FileText, label: 'Privacy Policy' },
    { to: '/cookies', icon: FileText, label: 'Cookie Policy' },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <Button 
        variant="outline" 
        size="icon" 
        className="fixed top-4 left-4 z-50 md:hidden bg-white shadow-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar flex flex-col shadow-lg transition-transform duration-300 ease-in-out",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo section */}
        <div className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2" onClick={closeSidebar}>
            <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-2 rounded-md">
              <PiSquare className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-avante-blue to-avante-purple bg-clip-text text-transparent">
                Avante Maps
              </span>
              <span className="text-xs text-muted-foreground">Pi Payment Finder</span>
            </div>
          </Link>
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
                  onClick={closeSidebar}
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
                  onClick={closeSidebar}
                />
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p>© 2023 Avante Maps</p>
          <p>Powered by Pi Network</p>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
