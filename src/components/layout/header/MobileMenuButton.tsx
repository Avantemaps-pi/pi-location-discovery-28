
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { navItems, legalItems } from '@/components/layout/sidebar/sidebarConfig';
import { X, UserRound, LogIn, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import NavItem from '@/components/layout/sidebar/NavItem';
import { useAuth } from '@/context/auth';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

interface MobileMenuButtonProps {
  onClick?: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();
  const username = user?.username || 'Guest';
  
  const formatPlanType = (tier?: string) => {
    if (!tier) return 'Individual';
    return tier.charAt(0).toUpperCase() + tier.slice(1).replace('-', ' ');
  };
  
  const planType = formatPlanType(user?.subscriptionTier);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };
  
  const handleAuthAction = () => {
    if (isAuthenticated) {
      logout();
    } else {
      login();
    }
    setIsOpen(false);
  };
  
  const handleLinkClick = () => {
    setIsOpen(false);
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={toggleMenu}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
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
                  <span className="font-medium text-sm">{username}</span>
                  <span className="text-xs text-muted-foreground">{planType} Plan</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-2 mb-4">
                <Button 
                  onClick={handleAuthAction} 
                  disabled={isLoading}
                  className={cn(
                    "w-full flex items-center",
                    isAuthenticated 
                      ? "bg-white hover:bg-gray-100 border border-red-500 text-red-500" 
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  )}
                >
                  {isAuthenticated ? (
                    <>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  )}
                </Button>
              </div>
              
              <nav className="px-2 space-y-6">
                <div>
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Navigation</h3>
                  <ul className="mt-2 space-y-1">
                    {navItems.map(item => (
                      <NavItem 
                        key={item.to} 
                        to={item.to} 
                        icon={item.icon} 
                        label={item.label} 
                        badge={item.badge} 
                        isActive={location.pathname === item.to} 
                        onClick={handleLinkClick} 
                      />
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Legal</h3>
                  <ul className="mt-2 space-y-1">
                    {legalItems.map(item => (
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
              </nav>
            </div>
            
            <div className="p-4 border-t border-sidebar-border text-xs text-muted-foreground">
              <p>© 2025 Avante Maps</p>
              <p>By Avante Maps Pty Ltd</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileMenuButton;
