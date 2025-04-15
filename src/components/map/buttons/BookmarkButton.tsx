
import React from 'react';
import { Bookmark } from 'lucide-react';

interface BookmarkButtonProps {
  isBookmarked: boolean;
  onToggle: (e: React.MouseEvent) => void;
}

const BookmarkButton: React.FC<BookmarkButtonProps> = ({ isBookmarked, onToggle }) => {
  return (
    <Bookmark 
      className={`h-5 w-5 cursor-pointer z-[101] ${isBookmarked ? 'text-blue-500 fill-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
      onClick={onToggle}
    />
  );
};

export default BookmarkButton;
