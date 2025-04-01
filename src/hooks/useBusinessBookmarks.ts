
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useBusinessBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load bookmarks when user is authenticated
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!isAuthenticated || !user) {
        setBookmarks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('bookmarks')
          .select('business_id')
          .eq('user_id', user.uid);

        if (error) {
          throw error;
        }

        const bookmarkIds = data.map(item => item.business_id);
        setBookmarks(bookmarkIds);
      } catch (error) {
        console.error('Error loading bookmarks:', error);
        toast.error('Failed to load your bookmarks');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [isAuthenticated, user]);

  // Toggle bookmark
  const toggleBookmark = async (businessId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to bookmark businesses');
      return false;
    }

    try {
      const isBookmarked = bookmarks.includes(businessId);

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.uid)
          .eq('business_id', businessId);

        if (error) throw error;

        setBookmarks(prev => prev.filter(id => id !== businessId));
        toast.success('Bookmark removed');
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({ user_id: user.uid, business_id: businessId });

        if (error) throw error;

        setBookmarks(prev => [...prev, businessId]);
        toast.success('Business bookmarked');
      }

      return true;
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast.error('Failed to update bookmark');
      return false;
    }
  };

  return {
    bookmarks,
    isBookmarked: (id: string) => bookmarks.includes(id),
    toggleBookmark,
    isLoading
  };
};
