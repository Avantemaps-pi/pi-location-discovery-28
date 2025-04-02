
import { useState, useMemo } from 'react';
import { generateEngagementData } from '../data/AnalyticsData';

export const useAnalyticsData = () => {
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
  
  const metrics = useMemo(() => {
    const totalViews = engagementData.reduce((sum, item) => sum + item.views, 0);
    const totalClicks = engagementData.reduce((sum, item) => sum + item.clicks, 0);
    const totalBookmarks = engagementData.reduce((sum, item) => sum + item.bookmarks, 0);
    
    const clickRate = ((totalClicks / totalViews) * 100).toFixed(1);
    const bookmarkRate = ((totalBookmarks / totalViews) * 100).toFixed(1);
    
    return {
      totalViews,
      totalClicks,
      totalBookmarks,
      clickRate,
      bookmarkRate
    };
  }, [engagementData]);

  return {
    dateRange,
    setDateRange,
    engagementData,
    metrics
  };
};
