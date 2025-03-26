
import { 
  Menu, PiSquare, X, Home, Compass, Bookmark, User, Bell, 
  Building2, ClipboardList, Mail, Info, Settings, FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';
import DarkModeToggle from '@/components/ui/DarkModeToggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

interface PageHeaderProps {
  title?: string;
}

const PageHeader = ({ title = "Avante Maps" }: PageHeaderProps) => {
  const { toggleSidebar } = useSidebar();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const handleCloseMobileMenu = () => {
    setShowMobileMenu(false);
  };
  
  return (
    <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-30 w-full border-b border-border/40 px-4 md:px-6 shadow-sm">
      <div className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Dropdown */}
          <DropdownMenu open={showMobileMenu} onOpenChange={setShowMobileMenu}>
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
            <DropdownMenuContent 
              align="start" 
              className="w-[85vw] max-w-[350px] p-0 rounded-lg overflow-hidden"
              forceMount 
            >
              <div className="bg-background rounded-t-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-gradient-to-r from-avante-blue to-avante-purple p-2 rounded-md">
                    <PiSquare className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">{title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCloseMobileMenu}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Login Button */}
              <div className="p-4">
                <Button variant="outline" className="w-full flex items-center gap-2 text-base py-6">
                  <span className="text-xl">➔</span>
                  <span>Login</span>
                </Button>
              </div>
              
              {/* Main Navigation */}
              <div className="px-2 py-1">
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/">
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/recommendations">
                    <Compass className="h-5 w-5" />
                    <span>Recommendations</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/bookmarks">
                    <Bookmark className="h-5 w-5" />
                    <span>Bookmarks</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/communicon">
                    <User className="h-5 w-5" />
                    <span>Communicon</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base relative">
                  <Link to="/notifications">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                    <span className="absolute right-4 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                      2
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/registered-business">
                    <Building2 className="h-5 w-5" />
                    <span>My Businesses</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/registration">
                    <ClipboardList className="h-5 w-5" />
                    <span>Register Business</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/contact">
                    <Mail className="h-5 w-5" />
                    <span>Contact</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/about">
                    <Info className="h-5 w-5" />
                    <span>About Us</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/settings">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              
              {/* Legal Section */}
              <div className="mt-2 px-2 py-1">
                <DropdownMenuLabel className="px-4 text-sm text-muted-foreground font-medium">
                  LEGAL
                </DropdownMenuLabel>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/terms">
                    <FileText className="h-5 w-5" />
                    <span>Terms of Service</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/privacy">
                    <FileText className="h-5 w-5" />
                    <span>Privacy Policy</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="flex items-center gap-3 px-4 py-3 text-base">
                  <Link to="/cookies">
                    <FileText className="h-5 w-5" />
                    <span>Cookie Policy</span>
                  </Link>
                </DropdownMenuItem>
              </div>
              
              {/* Footer */}
              <div className="p-4 mt-2 border-t border-border text-xs text-muted-foreground">
                <p>© 2023 Avante Maps</p>
                <p>Architectured by Avante Labs</p>
              </div>
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
