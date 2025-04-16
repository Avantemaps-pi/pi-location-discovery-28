
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';
import { motion } from '@/components/ui/motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/context/auth';
import LoginDialog from '@/components/auth/LoginDialog';

const Registration = () => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  
  // Check if user is authenticated when the component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      setShowLoginDialog(true);
    }
  }, [isAuthenticated]);

  const handleLoginDialogClose = (open: boolean) => {
    setShowLoginDialog(open);
    if (!open && !isAuthenticated) {
      // If the dialog is closed and the user is still not authenticated, navigate back
      navigate('/');
    }
  };
  
  return (
    <AppLayout title="Avante Maps" fullHeight hideSidebar={true}>
      <motion.div 
        className="w-full max-w-5xl mx-auto px-4 py-4 md:py-6 overflow-y-auto prevent-overflow form-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        skipMobileAnimations={isMobile}
      >
        <BusinessRegistrationForm />
      </motion.div>
      
      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={handleLoginDialogClose} />
    </AppLayout>
  );
};

export default Registration;
