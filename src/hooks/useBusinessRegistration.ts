import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/components/business/registration/formSchema';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/context/auth';
import { useBusinessImages } from './business/useBusinessImages';
import { geocodeAddress } from '@/utils/business/geocoding';
import { formatBusinessData } from '@/utils/business/formatBusinessData';
import { uploadBusinessImages } from '@/utils/business/uploadBusinessImages';

export const useBusinessRegistration = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedImages, handleImageUpload, handleImageRemove } = useBusinessImages();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      businessName: '',
      phone: '',
      email: '',
      website: '',
      streetAddress: '',
      apartment: '',
      state: '',
      zipCode: '',
      businessTypes: [],
      businessDescription: '',
      piWalletAddress: user?.walletAddress || '',
      mondayOpen: '09:00',
      mondayClose: '17:00',
      mondayClosed: false,
      tuesdayOpen: '09:00',
      tuesdayClose: '17:00',
      tuesdayClosed: false,
      wednesdayOpen: '09:00',
      wednesdayClose: '17:00',
      wednesdayClosed: false,
      thursdayOpen: '09:00',
      thursdayClose: '17:00',
      thursdayClosed: false,
      fridayOpen: '09:00',
      fridayClose: '17:00',
      fridayClosed: false,
      saturdayOpen: '10:00',
      saturdayClose: '16:00',
      saturdayClosed: false,
      sundayOpen: '10:00',
      sundayClose: '16:00', 
      sundayClosed: false,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      if (!user?.uid) {
        toast.error('You must be logged in to register a business.');
        return;
      }

      setIsSubmitting(true);
      console.log('Starting business registration submission with values:', values);

      const { data: buckets, error: bucketError } = await supabase
        .storage
        .listBuckets();
      
      console.log('Available storage buckets:', buckets);
      
      const businessBucketExists = buckets?.some(bucket => bucket.name === 'business-images');
      
      if (bucketError) {
        console.error('Error checking storage buckets:', bucketError);
      }

      const fullAddress = `${values.streetAddress}, ${values.state}, ${values.zipCode}`;
      console.log('Geocoding address:', fullAddress);
      
      const coordinates = await geocodeAddress(fullAddress);
      
      if (!coordinates) {
        toast.error('Could not locate address. Please check and try again.');
        setIsSubmitting(false);
        return;
      }
      
      console.log('Coordinates obtained:', coordinates);
      
      const businessData = formatBusinessData(values, coordinates, user.uid);
      
      console.log('Submitting business data to Supabase:', businessData);
      
      const { data, error } = await supabase
        .from('businesses')
        .insert(businessData)
        .select();
        
      if (error) {
        console.error('Error submitting business data:', error);
        toast.error(`Failed to register business: ${error.message}`);
        setIsSubmitting(false);
        return;
      }
      
      console.log('Business successfully registered:', data);
      
      if (selectedImages.length > 0 && data && data[0]?.id) {
        await uploadBusinessImages(data[0].id, selectedImages, businessBucketExists);
      }

      toast.success('Business registration submitted successfully!');
      
      if (onSuccess) onSuccess();
      
      navigate('/', { 
        state: { 
          newBusiness: true,
          businessData: {
            ...data?.[0],
            position: coordinates,
          }
        } 
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register business. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    selectedImages,
    handleImageUpload,
    handleImageRemove,
    onSubmit,
    isSubmitting
  };
};
