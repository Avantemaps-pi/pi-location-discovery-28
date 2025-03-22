
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Download } from 'lucide-react';

interface AnalyticsHeaderProps {
  businessName: string;
  dateRange: string;
  onDateRangeChange: (value: string) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  businessName,
  dateRange,
  onDateRangeChange,
  onExport
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{businessName} Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track your business performance and engagement metrics
        </p>
      </div>
      
      <div className="flex items-center space-x-2 self-end sm:self-auto">
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[140px]">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={(value) => onExport(value as 'csv' | 'pdf')}>
          <SelectTrigger className="w-[120px]">
            <Download className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Export" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="csv">Export as CSV</SelectItem>
            <SelectItem value="pdf">Export as PDF</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
