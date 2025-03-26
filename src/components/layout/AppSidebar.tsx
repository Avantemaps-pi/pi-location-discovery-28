
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopSidebar from './sidebar/DesktopSidebar';
import MobileSidebar from './sidebar/MobileSidebar';
import { navItems, legalItems } from './sidebar/sidebarConfig';

interface AppSidebarProps {
  className?: string;
}

const AppSidebar = ({ className }: AppSidebarProps = {}) => {
  const location = useLocation();
  const { openMobile, setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();
  
  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  return (
    <>
      {!isMobile ? (
        <DesktopSidebar
          className={className}
          navItems={navItems}
          legalItems={legalItems}
          currentPath={location.pathname}
          onLinkClick={handleLinkClick}
        />
      ) : (
        <MobileSidebar
          isOpen={openMobile}
          navItems={navItems}
          legalItems={legalItems}
          currentPath={location.pathname}
          onClose={() => setOpenMobile(false)}
          onLinkClick={handleLinkClick}
        />
      )}
    </>
  );
};

export default AppSidebar;
