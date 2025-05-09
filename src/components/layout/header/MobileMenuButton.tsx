
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

interface MobileMenuButtonProps {
  onClick?: () => void;
}

const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  const { setOpenMobile } = useSidebar();
  
  const handleClick = () => {
    setOpenMobile(true);
    if (onClick) onClick();
  };
  
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={handleClick}
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle menu</span>
    </Button>
  );
};

export default MobileMenuButton;
