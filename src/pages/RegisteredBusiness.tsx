
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import BusinessCard from '@/components/business/BusinessCard';
import BusinessSelector from '@/components/business/BusinessSelector';
import EmptyBusinessState from '@/components/business/EmptyBusinessState';
import { Business } from '@/types/business';

const RegisteredBusiness = () => {
  const businesses: Business[] = [
    {
      id: 1,
      name: "Pi Cafe",
      address: "123 Main St, San Francisco, CA",
      description: "A cozy cafe serving coffee and pastries. We accept Pi payments for all items.",
      isCertified: false
    },
    {
      id: 2,
      name: "Pi Tech Repairs",
      address: "456 Market St, San Francisco, CA",
      description: "Computer and phone repair services. Quick and reliable, accepting Pi cryptocurrency.",
      isCertified: false
    }
  ];

  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);

  // Filter businesses based on selection
  const filteredBusinesses = selectedBusinessId 
    ? businesses.filter(business => business.id.toString() === selectedBusinessId) 
    : businesses;

  return (
    <AppLayout title="My Registered Businesses">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Registered Businesses</h1>
            <p className="text-muted-foreground mt-1">Manage your Pi business</p>
          </div>
          <Button onClick={() => window.location.href = '/registration'}>Register New Business</Button>
        </div>

        {businesses.length > 0 && (
          <BusinessSelector 
            businesses={businesses} 
            selectedBusinessId={selectedBusinessId} 
            onSelect={setSelectedBusinessId} 
          />
        )}

        {businesses.length === 0 ? (
          <EmptyBusinessState />
        ) : (
          <div className="space-y-6">
            {filteredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default RegisteredBusiness;
