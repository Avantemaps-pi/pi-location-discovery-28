
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Place } from '@/data/mockPlaces';

interface DetailsCardProps {
  place: Place;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ place }) => {
  return (
    <Card className="w-full max-w-md bg-white shadow-lg rounded-lg overflow-hidden">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-gray-600 font-medium mb-2">Trading Hours</h3>
            <div className="text-sm space-y-1">
              <p>Sunday: Closed</p>
              <p>Monday: 9 AM - 6 PM</p>
              <p>Tuesday: 9 AM - 6 PM</p>
              <p>Wednesday: 9 AM - 6 PM</p>
              <p>Thursday: 9 AM - 6 PM</p>
              <p>Friday: 9 AM - 6 PM</p>
              <p>Saturday: 10 AM - 4 PM</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-600 font-medium mb-2">Categories</h3>
            <p className="text-sm">{place.category}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-gray-600 font-medium mb-2">Contact Details</h3>
            <div className="text-sm space-y-1">
              <p>Phone: (123) 456-7890</p>
              <p>Email: info@business.com</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-gray-600 font-medium mb-2">Website</h3>
            <a 
              href="https://www.business.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 flex items-center text-sm hover:underline"
            >
              www.business.com
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsCard;
