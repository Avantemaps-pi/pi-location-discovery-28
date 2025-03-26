
import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import PageHeader from './PageHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface AppLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
  fullWidth?: boolean;
  withHeader?: boolean;
  title?: string;
  backButton?: boolean;
  onBackClick?: () => void;
  className?: string; // Add this line
}

const AppLayout = ({ 
  children, 
  fullHeight = false,
  fullWidth = false,
  withHeader = true, 
  title = "Avante Maps",
  backButton = false,
  onBackClick,
  className = '' // Add this line with default empty string
}: AppLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {withHeader && <PageHeader title={title} />}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar />
        <main className={`flex-1 md:ml-64 ${className} ${fullHeight ? 'h-[calc(100vh-4rem)]' : ''} ${withHeader ? 'overflow-y-auto' : 'h-screen overflow-y-auto'}`}>
          <div className={`${fullHeight ? 'h-full' : ''} ${fullWidth ? 'w-full' : 'p-6'}`}>
            {backButton && onBackClick && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="mb-4" 
                onClick={onBackClick}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
