
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, UserRound, LogIn, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from '@/context/auth';
import { useIsMobile } from '@/hooks/use-mobile';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const { login, isLoading } = useAuth();
  const isMobile = useIsMobile();
  const [loginStage, setLoginStage] = useState<string>('idle');
  
  const handleLogin = async () => {
    try {
      setLoginStage('init');
      
      // Create a progress indicator
      const updateProgress = (stage: string) => {
        setLoginStage(stage);
      };
      
      // Add event listeners for SDK events
      const onSdkInit = () => updateProgress('connected');
      const onAuthStart = () => updateProgress('authenticating');
      
      // Register temporary listeners
      window.addEventListener('pi-sdk-init-success', onSdkInit);
      window.addEventListener('pi-auth-start', onAuthStart);
      
      await login();
      onOpenChange(false);
      
      // Clean up listeners
      window.removeEventListener('pi-sdk-init-success', onSdkInit);
      window.removeEventListener('pi-auth-start', onAuthStart);
    } catch (error) {
      console.error('Login failed:', error);
      setLoginStage('error');
    } finally {
      if (!isLoading) {
        setLoginStage('idle');
      }
    }
  };
  
  const handleContinueBrowsing = () => {
    onOpenChange(false);
  };
  
  const getLoginButtonText = () => {
    if (isLoading) {
      switch (loginStage) {
        case 'init': return "Initializing...";
        case 'connected': return "Connecting...";
        case 'authenticating': return "Authenticating...";
        default: return "Connecting...";
      }
    }
    return "Connect with Pi Network";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border rounded-lg shadow-lg bg-card">
        <div className="p-6 flex flex-col items-center">
          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-primary to-purple-500 flex items-center justify-center mb-6">
            <img src="/lovable-uploads/Avantemaps.png" alt="Pi Logo" className="w-12 h-12" />
          </div>
          
          <DialogTitle className="text-2xl mb-4 text-center font-bold">
            Sign in to <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Avante Maps</span>
          </DialogTitle>
          
          <div className="w-full bg-muted/50 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <img src="/lovable-uploads/Avantemaps.png" alt="User" className="w-8 h-8" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-lg">Pi Network User</p>
                <p className="text-sm text-muted-foreground">Connect with Pi Network</p>
              </div>
            </div>
          </div>
          
          {/* Login button with improved progress indication */}
          <Button 
            className="w-full mb-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {getLoginButtonText()}
              </>
            ) : (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Connect with Pi Network
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full mb-6" 
            onClick={handleContinueBrowsing}
          >
            Continue Browsing
          </Button>
          
          <div className="text-center text-sm text-muted-foreground px-4">
            <p>
              By connecting, Pi Network will share your profile information with Avante Maps. See our{' '}
              <Link to="/privacy-policy" className="text-primary hover:underline">privacy policy</Link>
              {' '}and{' '}
              <Link to="/terms-of-service" className="text-primary hover:underline">terms of service</Link>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
