
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AnalyticsMainView from '@/components/analytics/AnalyticsMainView';
import SubscriptionPrompt from '@/components/analytics/SubscriptionPrompt';
import { useFeatureAccess } from '@/hooks/useFeatureAccess';
import { SubscriptionTier } from '@/utils/piNetworkUtils';

const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const { hasPermission, isLoading } = useFeatureAccess(
    SubscriptionTier.ORGANIZATION,
    { redirectTo: '' } // We'll handle redirection within the component
  );
  
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
    alert(`Data would be exported as ${format} in a production environment`);
  };

  return (
    <AppLayout 
      title="Business Analytics"
      backButton={!hasPermission}
      withHeader={true}
      fullHeight={false}
      hideSidebar={false}
      onBackClick={!hasPermission ? () => navigate(-1) : undefined}
    >
      {!isLoading && !hasPermission ? (
        <SubscriptionPrompt />
      ) : (
        <AnalyticsMainView handleExport={handleExport} />
      )}
    </AppLayout>
  );
};

export default Analytics;
