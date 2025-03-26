
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PiSquare, X, UserRound } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavItem from './NavItem';

interface MobileSidebarProps {
  isOpen: boolean;
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
  onClose: () => void;
  onLinkClick: () => void;
}

const MobileSidebar = ({
  isOpen,
  navItems,
  legalItems,
  currentPath,
  onClose,
  onLinkClick
}: MobileSidebarProps) => {
  return (
    <div className={`md:hidden fixed inset-0 bg-background z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex flex-col h-full">
        <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>
                <UserRound className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm">Username</span>
              <span className="text-xs text-muted-foreground">Free Plan</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="p-4 border-b border-sidebar-border">
          <Button variant="outline" className="w-full flex items-center gap-2 text-base py-6">
            <span className="text-xl">➔</span>
            <span>Login</span>
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav>
            <ul className="space-y-1 px-2">
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

          <div className="mt-6 px-2">
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
        
        <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
          <p>© 2023 Avante Maps</p>
          <p>Architectured by Avante Labs</p>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
