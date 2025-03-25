
import { PiSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '@/components/ui/DarkModeToggle';

interface PageHeaderProps {
  title?: string;
}

const PageHeader = ({ title = "Avante Maps" }: PageHeaderProps) => {
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-30 w-full border-b border-border/40 px-4 md:px-6 shadow-sm">
      <div className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-2 rounded-md">
            <PiSquare className="h-5 w-5 text-white" />
          </div>
          <div className="hidden md:flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-avante-blue to-avante-purple bg-clip-text text-transparent">
              {title}
            </span>
            <span className="text-xs text-muted-foreground">Pi Payment Finder</span>
          </div>
          <span className="md:hidden font-bold text-lg">
            {title}
          </span>
        </Link>
        
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            U
          </div>
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
