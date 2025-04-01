
import React from 'react';
import { MapPin } from 'lucide-react';

interface PlaceCardAddressProps {
  address: string;
  onClick: () => void;
}

const PlaceCardAddress: React.FC<PlaceCardAddressProps> = ({ address, onClick }) => {
  return (
    <div 
      className="flex items-center gap-1 text-sm text-muted-foreground mb-2 cursor-pointer hover:text-primary transition-colors"
      onClick={onClick}
    >
      <MapPin className="h-4 w-4 flex-shrink-0" />
      <span className="text-xs line-clamp-1">{address}</span>
    </div>
  );
};

export default PlaceCardAddress;
