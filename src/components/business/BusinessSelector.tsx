
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Business } from '@/types/business';

interface BusinessSelectorProps {
  businesses: Business[];
  selectedBusinessId: string | null;
  onSelect: (id: string) => void;
}

const BusinessSelector = ({ businesses, selectedBusinessId, onSelect }: BusinessSelectorProps) => {
  return (
    <div className="mb-6">
      <Select value={selectedBusinessId || ""} onValueChange={onSelect}>
        <SelectTrigger className="w-full md:w-[300px]">
          <SelectValue placeholder="Select a business to view" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Businesses</SelectItem>
          {businesses.map(business => (
            <SelectItem key={business.id} value={business.id.toString()}>
              {business.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BusinessSelector;
