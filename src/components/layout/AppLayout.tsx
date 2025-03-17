
import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';

interface AppLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
}

const AppLayout = ({ children, fullHeight = false }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className={`flex-1 md:ml-64 ${fullHeight ? 'h-screen overflow-hidden' : 'p-6'}`}>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
