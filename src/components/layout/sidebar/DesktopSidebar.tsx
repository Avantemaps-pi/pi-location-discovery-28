
import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, PiSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar';
import NavItem from './NavItem';

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
  return (
    <Sidebar className={cn("hidden md:flex", className)}>
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
      
      <div className="p-4 border-b border-sidebar-border">
        <Button className="w-full flex items-center gap-2" variant="outline">
          <LogIn className="h-4 w-4" />
          <span>Login</span>
        </Button>
      </div>

      <SidebarContent>
        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-8">
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
          <PiSquare className="h-4 w-4 mr-1 text-avante-purple" />
          <span>Find Pi-enabled businesses near you</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DesktopSidebar;
