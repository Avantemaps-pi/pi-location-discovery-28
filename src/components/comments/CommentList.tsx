
import React, { useState } from 'react';
import CommentItem from './CommentItem';
import { SortOption } from './CommentSection';
import { toast } from 'sonner';

// Temporary mock data structure for comments
interface Comment {
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
  reports: number;
  userVote?: 'up' | 'down' | null;
  isReported: boolean;
}

interface CommentListProps {
  businessId: string | undefined;
  sortOption: SortOption;
}

const CommentList: React.FC<CommentListProps> = ({ businessId, sortOption }) => {
  // For this demo, we'll use mock data
  // In a real app, this would come from Supabase
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: {
        name: 'Alice Johnson',
        username: '@alice_pi',
        avatar: '/placeholder.svg',
        isVerified: true,
      },
      content: 'Great place! The staff was very friendly and the food was delicious. I would definitely recommend this to anyone visiting the area.',
      timestamp: '2023-04-15T14:30:00Z',
      upvotes: 15,
      downvotes: 2,
      reports: 0,
      userVote: null,
      isReported: false,
    },
    {
      id: '2',
      author: {
        name: 'Bob Smith',
        username: '@bobsmith_pi',
        avatar: '/placeholder.svg',
        isVerified: true,
      },
      content: 'The location is convenient but parking can be difficult during peak hours. The service was okay but could be improved.',
      timestamp: '2023-04-16T10:15:00Z',
      upvotes: 5,
      downvotes: 3,
      reports: 0,
      userVote: null,
      isReported: false,
    },
    {
      id: '3',
      author: {
        name: 'Charlie Davis',
        username: '@charlie_pi',
        avatar: '/placeholder.svg',
        isVerified: true,
      },
      content: 'I had a terrible experience here. The service was slow and the staff was rude. I would not recommend this place to anyone.',
      timestamp: '2023-04-17T16:45:00Z',
      upvotes: 2,
      downvotes: 8,
      reports: 1,
      userVote: null,
      isReported: false,
    }
  ]);

  // Sort comments based on the selected sort option
  const getSortedComments = () => {
    const sorted = [...comments];
    
    switch (sortOption) {
      case 'useful':
        return sorted.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
      case 'recent':
        return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case 'controversial':
        return sorted.sort((a, b) => (b.upvotes + b.downvotes) - (a.upvotes + a.downvotes));
      default:
        return sorted;
    }
  };

  const handleVote = (commentId: string, voteType: 'up' | 'down') => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          // If user already voted the same way, remove their vote
          if (comment.userVote === voteType) {
            return {
              ...comment,
              upvotes: voteType === 'up' ? comment.upvotes - 1 : comment.upvotes,
              downvotes: voteType === 'down' ? comment.downvotes - 1 : comment.downvotes,
              userVote: null
            };
          }
          
          // If user is changing their vote
          if (comment.userVote) {
            return {
              ...comment,
              upvotes: voteType === 'up' ? comment.upvotes + 1 : (comment.userVote === 'up' ? comment.upvotes - 1 : comment.upvotes),
              downvotes: voteType === 'down' ? comment.downvotes + 1 : (comment.userVote === 'down' ? comment.downvotes - 1 : comment.downvotes),
              userVote: voteType
            };
          }
          
          // If user is voting for the first time
          return {
            ...comment,
            upvotes: voteType === 'up' ? comment.upvotes + 1 : comment.upvotes,
            downvotes: voteType === 'down' ? comment.downvotes + 1 : comment.downvotes,
            userVote: voteType
          };
        }
        return comment;
      })
    );
  };

  const handleReport = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            reports: comment.reports + 1,
            isReported: true
          };
        }
        return comment;
      })
    );
    
    toast.success("Comment reported. Thank you for helping keep our community safe.");
  };

  const sortedComments = getSortedComments();

  if (sortedComments.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No comments yet. Be the first to share your thoughts!
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-full">
      {sortedComments.map(comment => (
        <CommentItem
          key={comment.id}
          comment={comment}
          onVote={handleVote}
          onReport={handleReport}
        />
      ))}
    </div>
  );
};

export default CommentList;
