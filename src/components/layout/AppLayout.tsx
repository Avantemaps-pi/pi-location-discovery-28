
import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import PageHeader from './PageHeader';

interface AppLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
  withHeader?: boolean;
  title?: string;
}

const AppLayout = ({ children, fullHeight = false, withHeader = true, title = "Avante Maps" }: AppLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {withHeader && <PageHeader title={title} />}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar className="hidden md:flex" />
        <main className={`flex-1 md:ml-64 ${fullHeight ? 'h-[calc(100vh-4rem)]' : ''} ${withHeader ? 'overflow-y-auto' : 'h-screen'}`}>
          <div className={fullHeight ? 'h-full' : 'p-6'}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
