import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import AnalyticCard from '@/components/analytics/AnalyticCard';
import AnalyticsHeader from '@/components/analytics/AnalyticsHeader';
import EngagementChart from '@/components/analytics/EngagementChart';
import RankingChart from '@/components/analytics/RankingChart';
import DistributionChart from '@/components/analytics/DistributionChart';
import { Eye, MousePointerClick, Search, Bookmark } from 'lucide-react';

const generateEngagementData = (days: number) => {
  const data = [];
  for (let i = 0; i < days; i++) {
    data.push({
      name: `Day ${i + 1}`,
      views: Math.floor(Math.random() * 500) + 200,
      clicks: Math.floor(Math.random() * 120) + 50,
      bookmarks: Math.floor(Math.random() * 20) + 5,
    });
  }
  return data;
};

const rankingData = [
  { keyword: 'Coffee shop', position: 1, searches: 2400, change: 2 },
  { keyword: 'Pi payment cafe', position: 2, searches: 1800, change: -1 },
  { keyword: 'Best cafe downtown', position: 3, searches: 1500, change: 1 },
  { keyword: 'Local coffee', position: 5, searches: 1200, change: 0 },
  { keyword: 'Pi cryptocurrency', position: 8, searches: 900, change: 3 },
];

const sourceDistribution = [
  { name: 'Direct Search', value: 42, color: '#3b82f6' },
  { name: 'Map Browse', value: 28, color: '#8b5cf6' },
  { name: 'Recommendations', value: 18, color: '#10b981' },
  { name: 'External Link', value: 12, color: '#f97316' },
];

const deviceDistribution = [
  { name: 'Mobile', value: 65, color: '#3b82f6' },
  { name: 'Desktop', value: 25, color: '#8b5cf6' },
  { name: 'Tablet', value: 10, color: '#10b981' },
];

const Analytics = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('week');
  
  const getDataForRange = () => {
    switch(dateRange) {
      case 'day': return generateEngagementData(24);
      case 'week': return generateEngagementData(7);
      case 'month': return generateEngagementData(30);
      case 'quarter': return generateEngagementData(90);
      case 'year': return generateEngagementData(12);
      default: return generateEngagementData(7);
    }
  };
  
  const engagementData = getDataForRange();
  
  const totalViews = engagementData.reduce((sum, item) => sum + item.views, 0);
  const totalClicks = engagementData.reduce((sum, item) => sum + item.clicks, 0);
  const totalBookmarks = engagementData.reduce((sum, item) => sum + item.bookmarks, 0);
  
  const clickRate = ((totalClicks / totalViews) * 100).toFixed(1);
  const bookmarkRate = ((totalBookmarks / totalViews) * 100).toFixed(1);
  
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
    alert(`Data would be exported as ${format} in a production environment`);
  };
  
  return (
    <AppLayout 
      title="Business Analytics"
      backButton={false}
      withHeader={true}
      fullHeight={false}
      hideSidebar={false}
    >
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
            value={totalViews.toLocaleString()}
            description="Impressions of your listing"
            icon={<Eye />}
            trend={12}
            trendDirection="up"
          />
          
          <AnalyticCard 
            title="Total Clicks"
            value={totalClicks.toLocaleString()}
            description={`${clickRate}% click rate`}
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
            value={totalBookmarks.toLocaleString()}
            description={`${bookmarkRate}% bookmark rate`}
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
    </AppLayout>
  );
};

export default Analytics;
