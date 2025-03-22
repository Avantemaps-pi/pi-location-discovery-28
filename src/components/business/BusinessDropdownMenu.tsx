
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { 
  MoreVertical,
  Trash,
  Share,
  BarChart
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BusinessDropdownMenuProps {
  businessId?: number;
}

const BusinessDropdownMenu = ({ businessId }: BusinessDropdownMenuProps) => {
  const navigate = useNavigate();

  const handleNavigateToAnalytics = () => {
    navigate('/analytics', { state: { businessId } });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="cursor-pointer" onClick={handleNavigateToAnalytics}>
          <BarChart className="mr-2 h-4 w-4" />
          <span>Analytics</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Share className="mr-2 h-4 w-4" />
          <span>Share</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-red-600">
          <Trash className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BusinessDropdownMenu;
