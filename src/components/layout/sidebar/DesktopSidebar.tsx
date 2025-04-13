
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar';
import NavItem from './NavItem';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

interface DesktopSidebarProps {
  className?: string;
  navItems: Array<{
    to: string;
    icon: React.ElementType;
    label: string;
    badge?: number | null;
  }>;
  legalItems: Array<{
    to: string;
    icon: React.ElementType;
    label: string;
  }>;
  currentPath: string;
  onLinkClick: () => void;
}

const DesktopSidebar = ({ 
  className, 
  navItems, 
  legalItems, 
  currentPath, 
  onLinkClick 
}: DesktopSidebarProps) => {
  const { isAuthenticated, login, logout, isLoading } = useAuth();
  
  // Function to handle authentication actions
  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
    onLinkClick();
  };
  
  return (
    <Sidebar className={cn("hidden md:flex", className)}>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/b0daa374-9909-4cf8-a2ae-e08e2184c3fc.png" 
            alt="Avante Maps" 
            className="h-8"
          />
          <div className="flex flex-col">
            <span className="font-bold text-lg text-foreground">
              Avante Maps
            </span>
            <span className="text-xs text-muted-foreground">Pi Payment Finder</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8">
          {/* Authentication Button - appears at the top */}
          <div className="mb-2">
            <Button 
              onClick={handleAuthAction}
              disabled={isLoading}
              className="w-full"
              variant="outline"
            >
              {isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  {isLoading ? "Authenticating..." : "Login with Pi"}
                </>
              )}
            </Button>
          </div>

          <nav>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={currentPath === item.to}
                  onClick={onLinkClick}
                  badge={item.badge}
                />
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-xs uppercase text-muted-foreground font-medium mb-2 px-3">Legal</h3>
            <ul className="space-y-1">
              {legalItems.map((item) => (
                <NavItem 
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  isActive={currentPath === item.to}
                  onClick={onLinkClick}
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
          <img 
            src="/lovable-uploads/b0daa374-9909-4cf8-a2ae-e08e2184c3fc.png" 
            alt="Avante Maps" 
            className="h-4 w-4 mr-1"
          />
          <span>Find Pi-enabled businesses near you</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DesktopSidebar;
