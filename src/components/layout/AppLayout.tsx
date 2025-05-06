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
  className?: string;
  hideSidebar?: boolean;
}
const AppLayout = ({
  children,
  fullHeight = false,
  fullWidth = false,
  withHeader = true,
  title = "Avante Maps",
  backButton = false,
  onBackClick,
  className = '',
  hideSidebar = false
}: AppLayoutProps) => {
  return <div className="flex flex-col min-h-screen bg-background">
      {withHeader && <PageHeader title={title} hideSidebar={hideSidebar} />}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar className={hideSidebar ? 'lg:hidden' : ''} />
        <main className={`flex-1 ${!hideSidebar && 'md:ml-64'} ${className} ${fullHeight ? 'h-[calc(100vh-4rem)]' : ''} ${withHeader ? 'overflow-y-auto overflow-x-hidden' : 'h-screen overflow-y-auto overflow-x-hidden'}`}>
          <div className="">
            {backButton && onBackClick && <Button variant="ghost" size="sm" className="mb-4" onClick={onBackClick}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>}
            {children}
          </div>
        </main>
      </div>
    </div>;
};
export default AppLayout;