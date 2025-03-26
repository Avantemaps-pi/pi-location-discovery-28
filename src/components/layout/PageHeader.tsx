
import React from 'react';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { useSidebar } from '@/components/ui/sidebar';
import Logo from './header/Logo';
import MobileMenuButton from './header/MobileMenuButton';
import DesktopMenuButton from './header/DesktopMenuButton';

interface PageHeaderProps {
  title?: string;
}

const PageHeader = ({ title = "Avante Maps" }: PageHeaderProps) => {
  const { toggleSidebar, setOpenMobile } = useSidebar();
  
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-30 w-full border-b border-border/40 px-4 md:px-6 shadow-sm">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Button */}
          <MobileMenuButton onClick={() => setOpenMobile(true)} />
          
          {/* Desktop Sidebar Toggle */}
          <DesktopMenuButton onClick={toggleSidebar} />
          
          {/* Logo and App Title */}
          <Logo title={title} />
        </div>
        
        <div className="flex items-center">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
