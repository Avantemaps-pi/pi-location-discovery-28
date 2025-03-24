
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface TabNavigationProps {
  isMobile: boolean;
  value: string;
  onValueChange: (value: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ isMobile, value, onValueChange }) => {
  return (
    <Tabs value={value} onValueChange={onValueChange} className="w-full">
      <TabsList className={cn(
        "grid mb-6 w-full",
        isMobile ? "grid-cols-3 gap-1" : "grid-cols-5"
      )}>
        <TabsTrigger value="business-owner" className="text-sm whitespace-nowrap">
          {isMobile ? "Owner" : "Business Owner"}
        </TabsTrigger>
        <TabsTrigger value="contact" className="text-sm">Contact</TabsTrigger>
        <TabsTrigger value="address" className="text-sm">Address</TabsTrigger>
        {isMobile && (
          <div className="col-span-3 mt-1">
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="hours" className="text-sm">Hours</TabsTrigger>
              <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
            </TabsList>
          </div>
        )}
        {!isMobile && (
          <>
            <TabsTrigger value="hours" className="text-sm">Hours</TabsTrigger>
            <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
          </>
        )}
      </TabsList>
    </Tabs>
  );
};

export default TabNavigation;
