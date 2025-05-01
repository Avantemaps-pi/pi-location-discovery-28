
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import MobileMenuButton from './header/MobileMenuButton';
import DesktopMenuButton from './header/DesktopMenuButton';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import AuthStatus from '@/components/auth/AuthStatus';

interface PageHeaderProps {
  title?: string;
  hideSidebar?: boolean;
}

const PageHeader = ({
  title = "Avante Maps",
  hideSidebar = false
}: PageHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    setOpenMobile
  } = useSidebar();
  
  // Determine the current page and set the display title
  const isAnalyticsPage = location.pathname === '/analytics';
  const isRegistrationPage = location.pathname === '/registration';
  const isIndexPage = location.pathname === '/';
  
  // Get page title based on the current path
  const getPageTitle = () => {
    if (isIndexPage) return "Avante Maps";
    if (isAnalyticsPage) return "Analytics";
    if (isRegistrationPage) return "Registration";
    
    // Extract the page name from the URL for other pages
    const path = location.pathname.substring(1); // Remove leading slash
    if (!path) return "Avante Maps";
    
    // Convert kebab-case to title case (e.g., "registered-business" to "Registered Business")
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayTitle = getPageTitle();
  
  const handleMenuClick = () => {
    setOpenMobile(true);
    console.log('Mobile menu opened');
  };
  
  return <header className="sticky top-0 z-10 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4">
        <div className="flex items-center">
          {/* Mobile menu button - only shows on mobile */}
          {!isAnalyticsPage && !hideSidebar && !isRegistrationPage && !isIndexPage && <MobileMenuButton />}
          
          {/* Desktop menu button - only shows on desktop */}
          {!isAnalyticsPage && !hideSidebar && !isRegistrationPage && !isIndexPage && <DesktopMenuButton onClick={() => console.log('Desktop menu clicked')} />}
          
          {/* Index page menu button */}
          {isIndexPage && <Button variant="ghost" size="icon" onClick={handleMenuClick} className="mr-2 block md:hidden flex items-center justify-center">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>}
          
          {/* Back button for analytics page */}
          {isAnalyticsPage && <Button variant="ghost" size="icon" onClick={() => navigate('/registered-business')} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>}
          
          {/* Back button for registration page */}
          {isRegistrationPage && <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to home</span>
            </Button>}
        </div>
        
        {/* Logo section with page title */}
        <div className="flex-1 flex justify-center items-center">
          <Link to="/" className={`flex items-center gap-2 ${isIndexPage ? 'mx-auto' : ''}`}>
            {/* Display page title for all pages except index */}
            <h1 className={`text-lg font-semibold ${isIndexPage ? 'hidden' : 'block'}`}>
              {displayTitle}
            </h1>
          </Link>
        </div>
        
        {/* Authentication status */}
        <div className="flex items-center space-x-4">
          <AuthStatus />
        </div>
      </div>
    </header>;
};

export default PageHeader;
