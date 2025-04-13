
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const { login } = useAuth();
  
  const handleLogin = () => {
    login();
    onOpenChange(false);
  };

  const handleContinueBrowsing = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-lg border-none shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">Welcome to Avante Maps</DialogTitle>
          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        
        <div className="flex flex-col items-center p-6 gap-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
            <img src="/lovable-uploads/816179f9-d16d-46a7-9d6e-169846c0d0da.png" alt="Pi Logo" className="w-12 h-12" />
          </div>
          
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold">You need to sign in first</h3>
            <p className="text-muted-foreground">Please login with your Pi Network account to register a business</p>
          </div>
          
          <div className="grid w-full gap-4">
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" 
              onClick={handleLogin}
            >
              Login with Pi Network
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={handleContinueBrowsing}
            >
              Continue Browsing
            </Button>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>
              By logging in, you agree to our{' '}
              <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
