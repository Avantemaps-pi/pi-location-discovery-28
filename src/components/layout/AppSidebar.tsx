
import React from 'react';
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
  User,
  Bell,
  Building2,
  ClipboardList,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar
} from '@/components/ui/sidebar';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  badge?: number | null;
}

const NavItem = ({ to, icon: Icon, label, isActive, onClick, badge }: NavItemProps) => (
  <li>
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground relative",
        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
      {badge && (
        <span className="absolute right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
          {badge}
        </span>
      )}
    </Link>
  </li>
);

const AppSidebar = () => {
  const location = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/recommendations', icon: Compass, label: 'Recommendations' },
    { to: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
    { to: '/communicon', icon: User, label: 'Communicon' },
    { to: '/notifications', icon: Bell, label: 'Notifications', badge: 2 },
    { to: '/registered-business', icon: Building2, label: 'My Businesses' },
    { to: '/registration', icon: ClipboardList, label: 'Register Business' },
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
    setOpenMobile(false);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex">
        <SidebarHeader className="p-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
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
        </SidebarHeader>
        
        {/* Login button */}
        <div className="p-4 border-b border-sidebar-border">
          <Button className="w-full flex items-center gap-2" variant="outline">
            <LogIn className="h-4 w-4" />
            <span>Login</span>
          </Button>
        </div>

        <SidebarContent>
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
                    badge={item.badge}
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
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p>© 2023 Avante Maps</p>
          <p>Powered by Pi Network</p>
          <div className="mt-2 flex items-center">
            <PiSquare className="h-4 w-4 mr-1 text-avante-purple" />
            <span>Find Pi-enabled businesses near you</span>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-0 bg-background z-40 transform transition-transform duration-300 ease-in-out ${openMobile ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          {/* Mobile Header with close button */}
          <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-2 rounded-md">
                <PiSquare className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">Avante Maps</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpenMobile(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Login Button */}
          <div className="p-4 border-b border-sidebar-border">
            <Button variant="outline" className="w-full flex items-center gap-2 text-base py-6">
              <span className="text-xl">➔</span>
              <span>Login</span>
            </Button>
          </div>
          
          {/* Navigation items */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav>
              <ul className="space-y-1 px-2">
                {navItems.map((item) => (
                  <NavItem 
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname === item.to}
                    onClick={handleLinkClick}
                    badge={item.badge}
                  />
                ))}
              </ul>
            </nav>

            {/* Legal links */}
            <div className="mt-6 px-2">
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
            <p>Architectured by Avante Labs</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSidebar;
