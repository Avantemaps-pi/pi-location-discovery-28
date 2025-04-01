
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, LogIn, WifiOff } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AuthStatus: React.FC = () => {
  const { isAuthenticated, user, logout, login, isLoading, isOffline } = useAuth();
  const location = useLocation();
  const isIndexPage = location.pathname === '/';

  if (isLoading) {
    return (
      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
        <Shield className="h-4 w-4" />
        <span>Authenticating...</span>
      </div>
    );
  }

  if (isOffline) {
    return (
      <div className="flex items-center space-x-1 text-sm text-amber-500">
        <WifiOff className="h-4 w-4" />
        <span>Offline</span>
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm hidden md:inline-block">{user.username}</span>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout} 
          className="h-8 px-2"
        >
          <LogOut className="h-4 w-4 mr-1" />
          <span className="hidden md:inline-block">Logout</span>
        </Button>
      </div>
    );
  }

  // Don't show login button on the index page
  if (isIndexPage) {
    return null;
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={login} 
      className="h-8" 
      disabled={isLoading}
    >
      <LogIn className="h-4 w-4 mr-1" />
      <span>Login with Pi</span>
    </Button>
  );
};

export default AuthStatus;
