
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PricingSection } from '@/components/ui/pricing-section';

// Define payment frequencies and pricing tiers
const PAYMENT_FREQUENCIES = ["monthly", "yearly"];

const TIERS = [
  {
    id: "free",
    name: "Free",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Basic features for all users",
    features: [
      "AI chat support",
      "Basic place recommendations",
      "Pi Map navigation",
      "Community forum access",
      "Save favorite locations",
    ],
    cta: "Current Plan",
  },
  {
    id: "standard",
    name: "Standard",
    price: {
      monthly: 5,
      yearly: 4,
    },
    description: "Great for active Pi users",
    features: [
      "Live chat support",
      "Priority recommendations",
      "Advanced Pi Map features",
      "Business verification priority",
      "Ad-free experience",
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    id: "premium",
    name: "Premium",
    price: {
      monthly: 10,
      yearly: 8,
    },
    description: "For serious Pi enthusiasts",
    features: [
      "24/7 Live support",
      "Personalized recommendations",
      "Early access to new features",
      "Priority business listing",
      "Custom maps and routes",
    ],
    cta: "Upgrade Now",
  },
  {
    id: "business",
    name: "Business",
    price: {
      monthly: 20,
      yearly: 16,
    },
    description: "For Pi-accepting merchants",
    features: [
      "Dedicated account manager",
      "Premium business profile",
      "Marketing toolkit",
      "Pi payment analytics",
      "Verified business badge",
    ],
    cta: "Contact Us",
    highlighted: true,
  },
];

const Pricing = () => {
  return (
    <AppLayout title="Upgrade Your Plan">
      <div className="relative w-full">
        <div className="absolute inset-0 -z-10">
          <div className="h-full w-full bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:35px_35px] opacity-30 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        </div>
        
        <div className="container mx-auto px-4 py-8">
          <PricingSection
            title="Unlock Premium Features"
            subtitle="Choose the plan that's right for you"
            frequencies={PAYMENT_FREQUENCIES}
            tiers={TIERS}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Pricing;
