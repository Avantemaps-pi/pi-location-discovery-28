
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Edit, 
  MapPin, 
  Clock
} from 'lucide-react';
import BusinessVerificationStatus from './BusinessVerificationStatus';
import BusinessDropdownMenu from './BusinessDropdownMenu';
import { Business } from '@/types/business';

interface BusinessCardProps {
  business: Business;
  onEdit?: (id: number) => void;
}

const BusinessCard = ({ business, onEdit }: BusinessCardProps) => {
  return (
    <Card key={business.id} className="overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 md:col-span-1 aspect-video md:aspect-auto flex items-center justify-center">
          <div className="text-center p-4">
            <Building className="h-12 w-12 text-gray-400 mx-auto" />
            <span className="block mt-2 text-sm text-muted-foreground">Business Image</span>
          </div>
        </div>
        
        <div className="p-6 md:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold">{business.name}</h2>
              <div className="flex items-center mt-1 text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{business.address}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => onEdit && onEdit(business.id)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
              <BusinessDropdownMenu businessId={business.id} />
            </div>
          </div>
          
          <p className="mt-4 text-gray-700">{business.description}</p>
          
          <div className="mt-6 space-y-5">
            <BusinessVerificationStatus />
            
            <BusinessVerificationStatus isCertification={true} />
            
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <div>
                <span className="text-sm font-medium">Registration Date</span>
                <p className="text-sm text-muted-foreground">July 15, 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BusinessCard;
