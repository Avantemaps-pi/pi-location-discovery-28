
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/layout/AppLayout';
import { PricingSection } from '@/components/ui/pricing-section';
import { toast } from 'sonner';
import { TIERS } from '@/components/pricing/pricingTiers';
import { useAuth } from '@/context/auth';
import { useSubscriptionPayment } from '@/components/pricing/useSubscriptionPayment';
import { requestWalletPermission } from '@/utils/piNetwork';

const Pricing = () => {
  const { user, isAuthenticated, login, refreshUserData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [previousPlan, setPreviousPlan] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showPermissionsDialog, setShowPermissionsDialog] = useState(false);
  const [isRequestingPermissions, setIsRequestingPermissions] = useState(false);
  
  // Get subscription payment utilities
  const { 
    userSubscriptionTier,
    selectedFrequency, 
    handleFrequencyChange,
    handleSubscribe,
    updateUserSubscription,
    isProcessingPayment 
  } = useSubscriptionPayment();
  
  // Handle frequency change
  const handleBillingChange = (frequency: string) => {
    handleFrequencyChange(frequency);
  };

  // Check if user was directed here from another page for subscription upgrade
  useEffect(() => {
    if (location.state && location.state.upgradeNeeded) {
      toast("Premium subscription required for this feature", {
        description: "Please subscribe to a paid plan to access this feature.",
        action: {
          label: "Dismiss",
          onClick: () => console.log("Dismissed"),
        },
      });
    }
    
    // Check for wallet permission issues from URL parameters
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('permissionsNeeded') === 'true') {
      setShowPermissionsDialog(true);
    }
  }, [location.state, location.search]);

  // Handle individual plan selection
  const handleIndividualPlanClick = async () => {
    if (userSubscriptionTier && userSubscriptionTier !== 'individual') {
      setPreviousPlan(userSubscriptionTier);
      setShowDialog(true);
    } else if (userSubscriptionTier !== 'individual') {
      // Update the subscription tier and refresh the UI
      await updateUserSubscription('individual');
    }
  };

  // Handle dialog confirmation
  const handleConfirmDowngrade = async () => {
    // Update the subscription tier and refresh the UI
    await updateUserSubscription('individual');
    toast.success('Your subscription has been updated to the Individual plan.');
    setShowDialog(false);
  };
  
  // Handle wallet permissions
  const handleGrantPermissions = async () => {
    if (isRequestingPermissions) return;
    
    setIsRequestingPermissions(true);
    setShowPermissionsDialog(false);
    
    toast.info("Requesting wallet address permission...");
    
    try {
      // First try to refresh user data through a full login
      await login();
      await refreshUserData();
      
      // If user still doesn't have wallet address, make a specific wallet request
      if (!user?.walletAddress) {
        const walletAddress = await requestWalletPermission();
        
        if (walletAddress) {
          toast.success("Wallet permission granted successfully");
          await refreshUserData(); // Make sure we have the latest user data
          
          // Clear the URL parameter
          navigate(location.pathname);
        } else {
          // Show dialog again if permission failed
          toast.error("Wallet permission is required for payments. Please try again.");
          setShowPermissionsDialog(true);
        }
      } else {
        toast.success("All required permissions granted");
        
        // Clear the URL parameter
        navigate(location.pathname);
      }
    } catch (error) {
      console.error("Error granting permissions:", error);
      toast.error("Error requesting permissions. Please try again.");
      // Show dialog again if permission failed
      setShowPermissionsDialog(true);
    } finally {
      setIsRequestingPermissions(false);
    }
  };
  
  return (
    <AppLayout title="Pricing">
      <PricingSection 
        title="Simple, transparent pricing"
        subtitle="Choose the plan that's right for you and explore Avante Maps with premium features."
        tiers={TIERS.map(tier => ({
          ...tier,
          onSubscribe: () => {
            if (tier.id === 'individual') {
              handleIndividualPlanClick();
            } else {
              handleSubscribe(tier.id);
            }
          },
          isLoading: isProcessingPayment || (tier.id !== 'individual' && isRequestingPermissions),
          disabled: false // Remove the comingSoon check to enable all tiers
        }))}
        frequencies={["monthly", "yearly"]}
        onFrequencyChange={handleBillingChange}
      />
      
      {/* Downgrade Confirmation Dialog */}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Plan Change</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to change from your current {previousPlan ? previousPlan.charAt(0).toUpperCase() + previousPlan.slice(1).replace('-', ' ') : ''} plan to the Individual plan? 
              You'll lose access to premium features.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
            <Button onClick={handleConfirmDowngrade}>Confirm Change</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Permissions Dialog */}
      <AlertDialog open={showPermissionsDialog} onOpenChange={setShowPermissionsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Additional Permissions Needed</AlertDialogTitle>
            <AlertDialogDescription>
              To process payments on Pi Network, your app needs permission to access your wallet address. 
              Please grant this permission to continue with your subscription purchase.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPermissionsDialog(false);
              navigate(location.pathname); // Clear URL parameters
            }}>Cancel</Button>
            <Button onClick={handleGrantPermissions} disabled={isRequestingPermissions}>
              {isRequestingPermissions ? 'Requesting...' : 'Grant Permissions'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
};

export default Pricing;
