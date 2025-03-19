
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Link } from "react-router-dom";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden rounded-lg">
        <div className="p-6 flex flex-col items-center">
          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="w-16 h-16 rounded-full bg-yellow-300 flex items-center justify-center mb-4">
            <img src="/lovable-uploads/816179f9-d16d-46a7-9d6e-169846c0d0da.png" alt="Pi Logo" className="w-8 h-8" />
          </div>
          
          <DialogTitle className="text-xl mb-1 text-center">
            Sign in to Avante Maps with <span className="text-purple-600 font-bold">Pi Network</span>
          </DialogTitle>
          
          <div className="flex items-center mt-6 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
              <img src="/placeholder.svg" alt="User" className="w-6 h-6" />
            </div>
            <div className="ml-3 text-left">
              <p className="font-medium">John Doe</p>
              <p className="text-sm text-gray-500">@johndoe_pi</p>
            </div>
          </div>
          
          <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
            Login as John
          </Button>
          
          <Button variant="outline" className="w-full mt-3 bg-gray-300 hover:bg-gray-400 text-gray-700">
            Continue Browsing
          </Button>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              To continue, Pi Network will share your username and profile picture with this site. See this site's{' '}
              <Link to="/privacy" className="text-blue-500 hover:underline">privacy policy</Link>
              {' '}and{' '}
              <Link to="/terms" className="text-blue-500 hover:underline">terms of service</Link>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
