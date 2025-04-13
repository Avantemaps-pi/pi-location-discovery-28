
import React from 'react';
import { useAuth } from '@/context/auth';
import { Shield, WifiOff } from 'lucide-react';

const AuthStatus: React.FC = () => {
  const { isAuthenticated, user, isLoading, isOffline } = useAuth();

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
        <span className="text-sm">{user.username}</span>
      </div>
    );
  }

  // Login button removed (now in sidebar)
  return null;
};

export default AuthStatus;
