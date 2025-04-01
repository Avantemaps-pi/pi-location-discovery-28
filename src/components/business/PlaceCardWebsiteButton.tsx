
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceCardWebsiteButtonProps {
  url: string;
}

const PlaceCardWebsiteButton: React.FC<PlaceCardWebsiteButtonProps> = ({ url }) => {
  return (
    <Button 
      variant="default" 
      size="sm" 
      className="bg-green-500 hover:bg-green-600 text-xs font-medium flex items-center gap-1 whitespace-nowrap h-9 px-3"
    >
      Website
      <ExternalLink className="h-3 w-3" />
    </Button>
  );
};

export default PlaceCardWebsiteButton;
