
import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DesktopMenuButtonProps {
  onClick: () => void;
}

const DesktopMenuButton = ({ onClick }: DesktopMenuButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="hidden md:inline-flex"
      onClick={onClick}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
};

export default DesktopMenuButton;
