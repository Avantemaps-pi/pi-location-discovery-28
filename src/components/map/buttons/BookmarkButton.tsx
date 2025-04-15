
import React from 'react';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/context/auth';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: (e: React.MouseEvent) => void;
  isLoading?: boolean;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onToggle, isLoading }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Bookmark 
      className={`h-5 w-5 cursor-pointer z-[101] transition-colors ${
        isLoading ? 'opacity-50' : ''
      } ${
        isBookmarked ? 'text-blue-500 fill-blue-500' : 'text-gray-400 hover:text-gray-600'
      } ${
        !isAuthenticated ? 'cursor-not-allowed opacity-70' : ''
      }`}
      onClick={onToggle}
    />
  );
};

export default BookmarkButton;
