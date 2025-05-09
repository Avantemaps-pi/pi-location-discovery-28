import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const MenuTest = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="p-4">
      <Button 
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        className="md:hidden"
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle menu</span>
      </Button>
      
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="w-[300px] p-0">
          <div className="flex h-full w-full flex-col p-4">
            <h2 className="text-xl font-semibold mb-4">Menu Test</h2>
            <ul className="space-y-2">
              <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">Home</li>
              <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">About</li>
              <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">Contact</li>
              <li className="p-2 hover:bg-gray-100 rounded-md cursor-pointer">Settings</li>
            </ul>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MenuTest;
