
import { Menu, PiSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PageHeaderProps {
  title?: string;
}

const PageHeader = ({ title = "Avante Maps" }: PageHeaderProps) => {
  const { toggleSidebar } = useSidebar();
  
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-30 w-full border-b border-border/40 px-4 md:px-6 shadow-sm">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Navigation</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/recommendations">Recommendations</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/bookmarks">Bookmarks</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/registration">Register Business</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/about">About Us</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/contact">Contact</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
          
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
        </div>
        
        <div className="flex items-center">
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
};

export default PageHeader;
