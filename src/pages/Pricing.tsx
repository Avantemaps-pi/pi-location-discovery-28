
import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PricingSection } from '@/components/ui/pricing-section';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define payment frequencies and pricing tiers
const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

const TIERS = [
  {
    id: "individual",
    name: "Individual",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Basic features for all users",
    features: [
      "AI chat support",
      "1 business listing",
    ],
    cta: "Current Plan",
  },
  {
    id: "small-business",
    name: "Small Business",
    price: {
      monthly: 5,
      yearly: 4,
    },
    description: "Great for active Pi users",
    features: [
      "AI chat support",
      "LIVE chat support",
      "3 business listings",
      "Certificate eligible",
      "Potential Media Coverage",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    id: "organization",
    name: "Organization",
    price: {
      monthly: 10,
      yearly: 8,
    },
    description: "For serious Pi enthusiasts",
    features: [
      "AI chat support",
      "LIVE chat support",
      "5 business listings",
      "Certificate eligible",
      "Media coverage",
      "Personalized media coverage",
      "Access to analytical business data",
      "No ads",
    ],
    cta: "Upgrade Now",
    highlighted: true,
    comingSoon: true,
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const organizationTierRef = useRef<HTMLDivElement>(null);
  
  const handleBack = () => {
    navigate(-1);
  };
  
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
  
  // Create a custom header with back button for the Pricing page
  const CustomHeader = () => (
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
  
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-y-auto">
      <CustomHeader />
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
                tiers={TIERS}
                organizationTierId="organization"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Pricing;
