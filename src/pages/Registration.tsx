
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';

const Registration = () => {
  return (
    <AppLayout title="Business Registration">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <BusinessRegistrationForm />
      </div>
    </AppLayout>
  );
};

export default Registration;
