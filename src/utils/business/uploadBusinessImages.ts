
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const uploadBusinessImages = async (
  businessId: string,
  images: File[],
  bucketExists: boolean
) => {
  if (images.length === 0) return;

  if (!bucketExists) {
    console.log('Creating business-images bucket');
    try {
      const { error: createBucketError } = await supabase
        .storage
        .createBucket('business-images', {
          public: true
        });
        
      if (createBucketError) {
        console.error('Error creating bucket:', createBucketError);
        toast.warning("Could not create storage bucket. Your business was registered but images couldn't be uploaded.");
        return;
      }
    } catch (bucketCreationError) {
      console.error('Error creating bucket:', bucketCreationError);
      return;
    }
  }

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    const filePath = `businesses/${businessId}/${image.name}`;
    
    console.log(`Uploading image ${i+1}:`, filePath);
    
    try {
      const { error: uploadError } = await supabase.storage
        .from('business-images')
        .upload(filePath, image);
        
      if (uploadError) {
        console.error(`Error uploading image ${i+1}:`, uploadError);
        toast.error(`Business registered, but image ${i+1} upload failed.`);
      } else {
        console.log(`Image ${i+1} uploaded successfully`);
      }
    } catch (uploadError) {
      console.error(`Error uploading image ${i+1}:`, uploadError);
    }
  }
};
