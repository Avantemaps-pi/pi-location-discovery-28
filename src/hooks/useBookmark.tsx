
import { useState } from 'react';

interface UseBookmarkProps {
  initialIsBookmarked: boolean;
  onRemove?: (id: string) => void;
  id: string;
}

export const useBookmark = ({ initialIsBookmarked, onRemove, id }: UseBookmarkProps) => {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked);

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    if (onRemove && !isBookmarked === false) {
      onRemove(id);
    }
  };

  return {
    isBookmarked,
    handleBookmarkToggle
  };
};
