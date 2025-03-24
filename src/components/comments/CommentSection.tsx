
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useParams, useLocation } from 'react-router-dom';
import CommentList from './CommentList';
import CommentSorter from './CommentSorter';
import LoginDialog from '@/components/auth/LoginDialog';
import { toast } from 'sonner';
import { filterInappropriateContent } from '@/utils/contentFilter';
import { useIsMobile } from '@/hooks/use-mobile';

// Comment sorting types
export type SortOption = 'useful' | 'recent' | 'controversial';

const CommentSection: React.FC<{ businessId?: string }> = ({ businessId }) => {
  const params = useParams();
  const location = useLocation();
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('useful');
  const isMobile = useIsMobile();
  
  // In a real app, this would come from authentication state
  const currentUser = {
    isLoggedIn: false,
    isVerified: false,
    name: 'John Doe',
    username: '@johndoe_pi',
    avatar: '/placeholder.svg',
    isRestricted: false
  };
  
  // Get business ID from props, params, or location state
  const targetBusinessId = businessId || 
                           params.businessId || 
                           (location.state?.businessDetails?.id);

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment before submitting");
      return;
    }
    
    if (!currentUser.isLoggedIn) {
      setLoginDialogOpen(true);
      return;
    }

    if (currentUser.isRestricted) {
      toast.error("Your commenting privileges have been restricted due to previous violations.");
      return;
    }
    
    if (!currentUser.isVerified) {
      toast.error("Only verified Pi Network users can post comments.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Filter inappropriate content
      const filteredComment = filterInappropriateContent(comment);
      
      // Here we would normally save to Supabase
      // For now, we'll just simulate the behavior
      
      setTimeout(() => {
        toast.success("Comment posted successfully!");
        setComment('');
        setIsSubmitting(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error posting comment:', error);
      toast.error("Failed to post comment. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <Card className={`${isMobile ? 'mt-4' : 'mt-8'} w-full`}>
      <CardHeader>
        <CardTitle className="text-xl">Comments & Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Textarea
            placeholder={currentUser.isRestricted 
              ? "Your commenting privileges have been restricted" 
              : "Share your thoughts about this place..."}
            value={comment}
            onChange={handleCommentChange}
            className="min-h-[100px] mb-2"
            disabled={currentUser.isRestricted || isSubmitting}
          />
          <div className="flex justify-between items-center">
            <p className="text-xs text-muted-foreground">
              Please keep comments respectful and relevant
            </p>
            <Button 
              onClick={handleSubmitComment} 
              disabled={isSubmitting || currentUser.isRestricted}
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </Button>
          </div>
        </div>
        
        <CommentSorter 
          sortOption={sortOption} 
          onSortChange={(option) => setSortOption(option)} 
        />
        
        <CommentList 
          businessId={targetBusinessId} 
          sortOption={sortOption} 
        />
      </CardContent>
      
      <LoginDialog 
        open={loginDialogOpen} 
        onOpenChange={setLoginDialogOpen} 
      />
    </Card>
  );
};

export default CommentSection;
