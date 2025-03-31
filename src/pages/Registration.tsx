
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';
import { motion } from '@/components/ui/motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Registration = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  return (
    <AppLayout title="Avante Maps" fullHeight hideSidebar={true}>
      <div className="flex items-center mb-4 px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate('/')} 
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <h2 className="text-xl font-medium">Registration</h2>
      </div>
      <motion.div 
        className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 overflow-y-auto prevent-overflow"
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
