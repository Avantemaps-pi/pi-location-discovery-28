
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { PricingSection } from '@/components/ui/pricing-section';
import PricingHeader from '@/components/pricing/PricingHeader';
import { useSubscriptionPayment } from '@/components/pricing/useSubscriptionPayment';
import { PAYMENT_FREQUENCIES, TIERS } from '@/components/pricing/pricingTiers';

const Pricing = () => {
  const location = useLocation();
  const { 
    isProcessingPayment, 
    selectedFrequency, 
    handleFrequencyChange, 
    handleSubscribe,
    userSubscriptionTier 
  } = useSubscriptionPayment();
  
  useEffect(() => {
    // Check if we're redirected from LIVE chat
    if (location.state?.fromLiveChat) {
      // Use setTimeout to ensure the DOM is fully rendered
      setTimeout(() => {
        // Find the organization tier element by ID
        const organizationTier = document.getElementById('tier-organization');
        if (organizationTier) {
          // Scroll to the organization tier with a smooth animation
          organizationTier.scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
          });
          // Add a subtle highlight animation
          organizationTier.classList.add('animate-pulse-subtle');
          setTimeout(() => {
            organizationTier.classList.remove('animate-pulse-subtle');
          }, 2000);
        }
      }, 100);
    }
  }, [location.state]);
  
  // Create custom pricing tiers with click handlers
  const customTiers = TIERS.map(tier => ({
    ...tier,
    onSubscribe: () => handleSubscribe(tier.id),
    isLoading: isProcessingPayment,
    disabled: tier.comingSoon || // Coming soon
             (tier.id !== "individual" && userSubscriptionTier === tier.id), // Already subscribed (except for free tier)
    cta: userSubscriptionTier === tier.id && tier.id !== "individual"
         ? "Current Plan" 
         : tier.cta
  }));
  
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-y-auto">
      <PricingHeader />
      <div className="flex flex-1 overflow-y-auto">
        <main className="flex-1 overflow-y-auto">
          <div className="relative w-full">
            <div className="absolute inset-0 -z-10">
              <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
            </div>
            
            <div className="container mx-auto px-4 py-8">
              <PricingSection
                title="Unlock Premium Features with Pi"
                subtitle="Choose the plan that's right for you"
                frequencies={PAYMENT_FREQUENCIES}
                tiers={customTiers}
                organizationTierId="organization"
                onFrequencyChange={handleFrequencyChange}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pricing;
