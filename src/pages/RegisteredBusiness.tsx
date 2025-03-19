
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BusinessCard from '@/components/business/BusinessCard';
import BusinessSelector from '@/components/business/BusinessSelector';
import EmptyBusinessState from '@/components/business/EmptyBusinessState';
import BusinessHeader from '@/components/business/BusinessHeader';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Business } from '@/types/business';

const RegisteredBusiness = () => {
  const navigate = useNavigate();
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
  const filteredBusinesses = selectedBusinessId && selectedBusinessId !== "all"
    ? businesses.filter(business => business.id.toString() === selectedBusinessId) 
    : businesses;

  return (
    <AppLayout title="My Registered Businesses">
      <div className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <BusinessHeader 
          title="My Registered Businesses" 
          subtitle="Manage your Pi business" 
          showButton={false}
        />

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
          <Button onClick={() => navigate('/registration')}>Register New Business</Button>
          
          {businesses.length > 0 && (
            <div className="w-full md:w-[300px]">
              <BusinessSelector 
                businesses={businesses} 
                selectedBusinessId={selectedBusinessId} 
                onSelect={setSelectedBusinessId} 
              />
            </div>
          )}
        </div>

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
