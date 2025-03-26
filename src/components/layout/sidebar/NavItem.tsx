
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

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

export default NavItem;
