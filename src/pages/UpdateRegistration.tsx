
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 overflow-y-auto">
        <div className="h-full p-6">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4" 
            onClick={handleGoBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <motion.div 
            className="w-full max-w-5xl mx-auto"
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
        </div>
      </main>
    </div>
  );
};

export default UpdateRegistration;
