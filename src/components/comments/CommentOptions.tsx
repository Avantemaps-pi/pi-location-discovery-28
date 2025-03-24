
import React from 'react';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface CommentOptionsProps {
  isReported: boolean;
  onReport: () => void;
}

const CommentOptions: React.FC<CommentOptionsProps> = ({ isReported, onReport }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="px-2">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {/* Report option removed as requested */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CommentOptions;
