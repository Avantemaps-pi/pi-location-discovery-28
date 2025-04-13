import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick?: () => void;
  badge?: number | null;
}

const NavItem = ({ to, icon: Icon, label, isActive, onClick, badge }: NavItemProps) => {
  const { logout } = useAuth();
  
  const handleClick = () => {
    if (to === "/logout") {
      logout();
    } else if (onClick) {
      onClick();
    }
  };
  
  const buttonContent = (
    <>
      <Icon className="h-5 w-5" />
      <span className="ml-3">{label}</span>
      {badge !== undefined && badge > 0 && (
        <div className="ml-auto bg-primary rounded-full min-w-[1.5rem] h-6 flex items-center justify-center px-1.5">
          <span className="text-xs font-medium text-primary-foreground">{badge}</span>
        </div>
      )}
    </>
  );
  
  if (to === "/logout") {
    return (
      <li>
        <button
          onClick={handleClick}
          className={cn(
            "flex items-center w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive 
              ? "bg-accent text-accent-foreground" 
              : "hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {buttonContent}
        </button>
      </li>
    );
  }
  
  return (
    <li>
      <Link
        to={to}
        onClick={handleClick}
        className={cn(
          "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isActive 
            ? "bg-accent text-accent-foreground" 
            : "hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {buttonContent}
      </Link>
    </li>
  );
};

export default NavItem;
