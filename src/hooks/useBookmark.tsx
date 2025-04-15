
import { useState, useEffect } from 'react';
import { useBusinessBookmarks } from '@/hooks/useBusinessBookmarks';

interface UseBookmarkProps {
  initialIsBookmarked: boolean;
  onRemove?: (id: string) => void;
  id: string;
}

export const useBookmark = ({ initialIsBookmarked, onRemove, id }: UseBookmarkProps) => {
  const { isBookmarked: isBookmarkedInDB, toggleBookmark: toggleBookmarkInDB } = useBusinessBookmarks();
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked || isBookmarkedInDB(id));
  
  // Sync state with database when component mounts
  useEffect(() => {
    setIsBookmarked(initialIsBookmarked || isBookmarkedInDB(id));
  }, [id, initialIsBookmarked, isBookmarkedInDB]);

  const handleBookmarkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Toggle bookmark in database
    const success = await toggleBookmarkInDB(id);
    
    if (success) {
      // Update local state if database update was successful
      const newIsBookmarked = !isBookmarked;
      setIsBookmarked(newIsBookmarked);
      
      // If onRemove callback exists and we're unbookmarking, call it
      if (onRemove && newIsBookmarked === false) {
        onRemove(id);
      }
    }
  };

  return {
    isBookmarked,
    handleBookmarkToggle
  };
};
