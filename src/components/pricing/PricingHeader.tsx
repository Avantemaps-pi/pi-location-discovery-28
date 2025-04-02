
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const PricingHeader = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <header className="h-16 border-b flex items-center px-4 bg-white">
      <Button variant="ghost" size="icon" className="mr-auto" onClick={handleBack}>
        <ArrowLeft className="h-9 w-9" />
        <span className="sr-only">Go back</span>
      </Button>
      
      <div className="flex-1 flex justify-center">
        <h1 className="text-xl font-bold">Avante Maps</h1>
      </div>
      
      <div className="w-10"></div>
    </header>
  );
};

export default PricingHeader;
