
import React from 'react';
import { Eye, MousePointerClick, Search, Bookmark } from 'lucide-react';
import AnalyticCard from './AnalyticCard';
import AnalyticsHeader from './AnalyticsHeader';
import EngagementChart from './EngagementChart';
import RankingChart from './RankingChart';
import DistributionChart from './DistributionChart';
import { useAnalyticsData } from './hooks/useAnalyticsData';
import { rankingData, sourceDistribution, deviceDistribution } from './data/AnalyticsData';

interface AnalyticsMainViewProps {
  handleExport: (format: 'csv' | 'pdf') => void;
}

const AnalyticsMainView: React.FC<AnalyticsMainViewProps> = ({ handleExport }) => {
  const { dateRange, setDateRange, engagementData, metrics } = useAnalyticsData();
  
  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 max-w-7xl">
      <AnalyticsHeader 
        businessName="Pi Cafe"
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-8">
        <AnalyticCard 
          title="Total Views"
          value={metrics.totalViews.toLocaleString()}
          description="Impressions of your listing"
          icon={<Eye />}
          trend={12}
          trendDirection="up"
        />
        
        <AnalyticCard 
          title="Total Clicks"
          value={metrics.totalClicks.toLocaleString()}
          description={`${metrics.clickRate}% click rate`}
          icon={<MousePointerClick />}
          trend={8}
          trendDirection="up"
        />
        
        <AnalyticCard 
          title="Average Position"
          value="2.4"
          description="In search results"
          icon={<Search />}
          trend={2}
          trendDirection="up"
        />
        
        <AnalyticCard 
          title="Total Bookmarks"
          value={metrics.totalBookmarks.toLocaleString()}
          description={`${metrics.bookmarkRate}% bookmark rate`}
          icon={<Bookmark />}
          trend={5}
          trendDirection="up"
        />
      </div>
      
      <div className="w-full mb-4 sm:mb-8 h-[400px] sm:h-[500px] md:h-[600px]">
        <EngagementChart 
          data={engagementData}
          title="Engagement Overview"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
        <div className="lg:col-span-2">
          <RankingChart 
            data={rankingData}
            title="Search Rankings"
            description="Your position for popular search keywords"
          />
        </div>
        
        <div className="lg:col-span-1 grid grid-cols-1 gap-4 sm:gap-6">
          <DistributionChart 
            data={sourceDistribution}
            title="Traffic Sources"
            description="How users find your business"
          />
          
          <DistributionChart 
            data={deviceDistribution}
            title="Device Usage"
            description="Devices used to access your listing"
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsMainView;
