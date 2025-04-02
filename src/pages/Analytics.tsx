
import React from 'react';
import AnalyticsView from '@/components/analytics/views/AnalyticsView';

const Analytics: React.FC = () => {
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
    alert(`Data would be exported as ${format} in a production environment`);
  };

  return <AnalyticsView handleExport={handleExport} />;
};

export default Analytics;
