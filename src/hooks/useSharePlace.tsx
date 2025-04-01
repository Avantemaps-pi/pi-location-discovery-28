
import { useToast } from './use-toast';

export const useSharePlace = (placeName: string, placeId: string) => {
  const { toast } = useToast();

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Web Share API - falls back to copy to clipboard
    if (navigator.share) {
      navigator.share({
        title: placeName,
        text: `Check out ${placeName} on Avante Maps`,
        url: window.location.origin + '?place=' + placeId
      }).catch(err => {
        console.error('Error sharing', err);
      });
    } else {
      // Fallback - copy link to clipboard
      navigator.clipboard.writeText(window.location.origin + '?place=' + placeId);
      toast({
        title: 'Success',
        description: 'Link copied to clipboard!',
        duration: 2000
      });
    }
  };

  return { handleShare };
};
