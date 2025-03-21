
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from '@/components/ui/motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { BusinessUpdateForm } from '@/components/business/BusinessUpdateForm';
import { Business } from '@/types/business';
import { toast } from 'sonner';

const UpdateRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const [business, setBusiness] = useState<Business | null>(null);
  
  useEffect(() => {
    // In a real app, we would fetch the business data from the API
    // For now, let's check if we have data in the location state
    if (location.state?.business) {
      setBusiness(location.state.business);
      setIsLoading(false);
    } else {
      // For demo purposes, load a mock business
      setTimeout(() => {
        setBusiness({
          id: 1,
          name: "Pi Cafe",
          address: "123 Main St, San Francisco, CA",
          description: "A cozy cafe serving coffee and pastries. We accept Pi payments for all items.",
          isCertified: false
        });
        setIsLoading(false);
      }, 1000);
    }
  }, [location]);

  const handleGoBack = () => {
    navigate('/registered-business');
  };

  const handleSuccess = () => {
    toast.success('Business information updated successfully!');
    navigate('/registered-business');
  };
  
  return (
    <AppLayout title="Avante Maps" fullHeight backButton onBackClick={handleGoBack}>
      <motion.div 
        className="w-full max-w-5xl mx-auto px-4 py-6 md:py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        skipMobileAnimations={isMobile}
      >
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading business information...</span>
          </div>
        ) : business ? (
          <BusinessUpdateForm business={business} onSuccess={handleSuccess} />
        ) : (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            Failed to load business information. Please try again.
          </div>
        )}
      </motion.div>
    </AppLayout>
  );
};

export default UpdateRegistration;
