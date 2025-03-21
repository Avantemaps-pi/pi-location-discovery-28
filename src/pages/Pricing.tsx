
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PricingSection } from '@/components/ui/pricing-section';

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
      "Media coverage",
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
      "Frequent media coverage",
      "Personalized media coverage",
      "Access to analytical business data",
    ],
    cta: "Upgrade Now",
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
