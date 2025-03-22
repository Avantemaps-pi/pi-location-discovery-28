
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';
import { motion } from '@/components/ui/motion';
import { useIsMobile } from '@/hooks/use-mobile';

const Registration = () => {
  const isMobile = useIsMobile();
  
  return (
    <AppLayout title="Avante Maps" fullHeight>
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
