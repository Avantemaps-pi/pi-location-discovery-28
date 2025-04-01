
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';
import MobileMenuButton from './header/MobileMenuButton';
import DesktopMenuButton from './header/DesktopMenuButton';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';

interface PageHeaderProps {
  title?: string;
  hideSidebar?: boolean;
}

const PageHeader = ({ title = "Avante Maps", hideSidebar = false }: PageHeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setOpenMobile } = useSidebar();
  const isAnalyticsPage = location.pathname === '/analytics';
  const isRegistrationPage = location.pathname === '/registration';
  const isIndexPage = location.pathname === '/';

  const handleMenuClick = () => {
    setOpenMobile(true);
  };

  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-full items-center px-4">
        {!isAnalyticsPage && !hideSidebar && !isRegistrationPage && !isIndexPage && <MobileMenuButton />}
        {!isAnalyticsPage && !hideSidebar && !isRegistrationPage && !isIndexPage && <DesktopMenuButton onClick={() => console.log('Desktop menu clicked')} />}
        
        {isIndexPage && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleMenuClick}
            className="mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        
        {isAnalyticsPage && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/registered-business')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        {isRegistrationPage && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        
        <Link to="/" className={`${(!isAnalyticsPage && !hideSidebar && !isRegistrationPage && !isIndexPage) ? 'ml-4' : ''} flex items-center gap-2`}>
          <img 
            src="/lovable-uploads/b0daa374-9909-4cf8-a2ae-e08e2184c3fc.png" 
            alt="Avante Maps" 
            className="h-8"
          />
        </Link>
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Add any other header elements here */}
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
