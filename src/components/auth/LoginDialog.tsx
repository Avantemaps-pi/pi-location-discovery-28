
import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const handleContinueBrowsing = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-0 rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <div className="p-6 flex flex-col items-center">
          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-avante-blue to-avante-purple flex items-center justify-center mb-6">
            <img src="/lovable-uploads/816179f9-d16d-46a7-9d6e-169846c0d0da.png" alt="Pi Logo" className="w-12 h-12" />
          </div>
          
          <DialogTitle className="text-2xl mb-4 text-center font-bold">
            Sign in to <span className="bg-gradient-to-r from-avante-blue to-avante-purple bg-clip-text text-transparent">Avante Maps</span> with Pi Network
          </DialogTitle>
          
          <div className="w-full bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <img src="/placeholder.svg" alt="User" className="w-8 h-8" />
              </div>
              <div className="ml-4 text-left">
                <p className="font-medium text-lg">John Doe</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">@johndoe_pi</p>
              </div>
            </div>
          </div>
          
          <Button className="w-full mb-3 bg-gradient-to-r from-avante-blue to-avante-purple hover:opacity-90 text-white font-medium py-3">
            Login as John
          </Button>
          
          <Button variant="outline" className="w-full mb-6 border border-gray-300 dark:border-gray-600 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700" onClick={handleContinueBrowsing}>
            Continue Browsing
          </Button>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 px-4">
            <p>
              To continue, Pi Network will share your username and profile picture with Avante Maps. See our{' '}
              <Link to="/privacy" className="text-blue-500 hover:text-blue-600 underline">privacy policy</Link>
              {' '}and{' '}
              <Link to="/terms" className="text-blue-500 hover:text-blue-600 underline">terms of service</Link>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
