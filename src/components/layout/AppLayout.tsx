
import { ReactNode } from 'react';
import AppSidebar from './AppSidebar';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';
import { useState } from 'react';

interface AppLayoutProps {
  children: ReactNode;
  fullHeight?: boolean;
  withHeader?: boolean;
  title?: string;
}

const AppLayout = ({ children, fullHeight = false, withHeader = false, title }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {withHeader && (
        <header className="h-14 border-b flex items-center px-4 bg-white">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <AppSidebar isSheet onClose={() => setIsSidebarOpen(false)} />
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
        </header>
      )}
      <div className="flex flex-1 overflow-hidden">
        <AppSidebar className="hidden md:flex" />
        <main className={`flex-1 md:ml-64 ${fullHeight ? 'h-[calc(100vh-3.5rem)]' : 'p-6'} ${withHeader ? '' : 'h-screen'}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
