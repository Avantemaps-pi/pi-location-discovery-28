
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebarContext } from './sidebar-context';
import { cn } from '@/lib/utils';
import { Building, ChevronDown, User, X } from 'lucide-react';
import { Button } from '../button';

const SidebarHeader = () => {
  const { collapsed, expanded, setExpanded, toggleCollapsed } = useSidebarContext();

  return (
    <div className="flex-shrink-0 overflow-x-hidden px-2">
      <div className="flex h-[60px] items-center">
        <div className="flex w-full justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <img src="/lovable-uploads/b0daa374-9909-4cf8-a2ae-e08e2184c3fc.png" alt="Logo" className="h-8 w-8" />
            {!collapsed && <span className="text-xl font-semibold">Avante Maps</span>}
          </NavLink>
          
          {!collapsed && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleCollapsed}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          )}
        </div>
      </div>
      
      {!collapsed && (
        <div className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
              <User className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Username</span>
              <span className="text-xs text-muted-foreground">Individual Plan</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>My Businesses</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <NavLink to="/settings">Settings</NavLink>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <NavLink to="/contact">Contact Us</NavLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
