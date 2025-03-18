
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';

const Registration = () => {
  return (
    <AppLayout title="Business Registration">
      <BusinessRegistrationForm />
    </AppLayout>
  );
};

export default Registration;
