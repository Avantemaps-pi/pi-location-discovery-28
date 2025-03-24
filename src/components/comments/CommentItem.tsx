
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ThumbsUp, 
  ThumbsDown, 
  Flag, 
  MoreVertical, 
  Clock,
  CheckCircle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CommentProps {
  comment: {
    id: string;
    author: {
      name: string;
      username: string;
      avatar: string;
      isVerified: boolean;
    };
    content: string;
    timestamp: string;
    upvotes: number;
    downvotes: number;
    userVote?: 'up' | 'down' | null;
    isReported: boolean;
  };
  onVote: (commentId: string, voteType: 'up' | 'down') => void;
  onReport: (commentId: string) => void;
}

const CommentItem: React.FC<CommentProps> = ({ comment, onVote, onReport }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // In a real app, this would come from authentication state
  const isLoggedIn = false;
  const isVerified = false;

  const handleVote = (voteType: 'up' | 'down') => {
    if (!isLoggedIn) {
      toast.error("Please log in to vote on comments");
      return;
    }
    
    if (!isVerified) {
      toast.error("Only verified Pi Network users can vote on comments");
      return;
    }
    
    onVote(comment.id, voteType);
  };

  const handleReport = () => {
    if (!isLoggedIn) {
      toast.error("Please log in to report comments");
      return;
    }
    
    if (!isVerified) {
      toast.error("Only verified Pi Network users can report comments");
      return;
    }
    
    if (comment.isReported) {
      toast.info("You have already reported this comment");
      return;
    }
    
    onReport(comment.id);
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'some time ago';
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if comment is long and needs to be truncated
  const isLongComment = comment.content.length > 200;
  const displayContent = isLongComment && !isExpanded 
    ? `${comment.content.substring(0, 200)}...` 
    : comment.content;

  return (
    <Card className="border-gray-200">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
              <img 
                src={comment.author.avatar} 
                alt={comment.author.name} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            <div>
              <div className="flex items-center">
                <span className="font-medium">{comment.author.name}</span>
                {comment.author.isVerified && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <CheckCircle className="h-3.5 w-3.5 ml-1 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Verified Pi Network User</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <Clock className="h-3 w-3 mr-1" />
                <span>{formatTimestamp(comment.timestamp)}</span>
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="px-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleReport} disabled={comment.isReported}>
                <Flag className="h-4 w-4 mr-2 text-red-500" />
                <span>Report Comment</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="mt-2 text-sm">
          <p>{displayContent}</p>
          {isLongComment && (
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto mt-1 text-blue-500"
              onClick={toggleExpand}
            >
              {isExpanded ? 'Show Less' : 'Read More'}
            </Button>
          )}
        </div>
        
        <div className="flex items-center mt-3 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className={`px-3 py-1 ${comment.userVote === 'up' ? 'bg-green-50 text-green-600 border-green-200' : ''}`}
            onClick={() => handleVote('up')}
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            <span>{comment.upvotes}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`px-3 py-1 ${comment.userVote === 'down' ? 'bg-red-50 text-red-600 border-red-200' : ''}`}
            onClick={() => handleVote('down')}
          >
            <ThumbsDown className="h-4 w-4 mr-2" />
            <span>{comment.downvotes}</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className={`px-3 py-1 ml-auto ${comment.isReported ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : ''}`}
            onClick={handleReport}
            disabled={comment.isReported}
          >
            <Flag className="h-4 w-4 mr-2" />
            <span>{comment.isReported ? 'Reported' : 'Report'}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
