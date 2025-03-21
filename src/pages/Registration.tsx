
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';
import { motion } from '@/components/ui/motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Registration = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  const handleUpdate = () => {
    navigate('/update-registration');
  };
  
  return (
    <AppLayout title="Avante Maps" fullHeight>
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleGoBack}
        >
          Back
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleUpdate}
        >
          Update Information
        </Button>
      </div>
      
      <motion.div 
        className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        skipMobileAnimations={isMobile}
      >
        <BusinessRegistrationForm />
      </motion.div>
    </AppLayout>
  );
};

export default Registration;
