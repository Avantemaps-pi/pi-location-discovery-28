import React from 'react';
import { useLocation } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import DesktopSidebar from './sidebar/DesktopSidebar';
import MobileSidebar from './sidebar/MobileSidebar';

const fallbackNavItems = [
  { label: 'Home', to: '/', icon: 'home' },
  { label: 'Notifications', to: '/notifications', icon: 'bell' },
];

const fallbackLegalItems = [
  { label: 'Terms of Service', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
];

const AppSidebar = () => {
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
          navItems={fallbackNavItems}
          legalItems={fallbackLegalItems}
          currentPath={location.pathname}
          onLinkClick={handleLinkClick}
        />
      ) : (
        <MobileSidebar
          isOpen={openMobile}
          navItems={fallbackNavItems}
          legalItems={fallbackLegalItems}
          currentPath={location.pathname}
          onClose={() => setOpenMobile(false)}
          onLinkClick={handleLinkClick}
        />
      )}
    </>
  );
};

export default AppSidebar;
