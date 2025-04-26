import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormValues, formSchema } from '@/components/business/registration/formSchema';
import { createBusiness, updateBusiness } from '@/api/business';
import { Business } from '@/types';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const useBusinessRegistration = (initialValues?: Business) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      category: initialValues?.category || '',
      website: initialValues?.website || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      streetAddress: initialValues?.streetAddress || '',
      apartment: initialValues?.apartment || '',
      city: initialValues?.city || '',
      state: initialValues?.state || '',
      zipCode: initialValues?.zipCode || '',
      acceptsPi: initialValues?.acceptsPi !== undefined ? initialValues.acceptsPi : false,
      businessHours: initialValues?.businessHours || '',
      images: initialValues?.images || [],
      ownerId: initialValues?.ownerId || '',
      location: initialValues?.location || { type: 'Point', coordinates: [0, 0] },
      placeId: initialValues?.placeId || '',
      formattedAddress: initialValues?.formattedAddress || '',
    },
    mode: 'onChange',
  });

  const nextTab = useCallback(() => {
    setActiveTab((current) => Math.min(current + 1, 3));
  }, []);

  const prevTab = useCallback(() => {
    setActiveTab((current) => Math.max(current - 1, 0));
  }, []);

  const onSubmit = useCallback(async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      if (initialValues?.id) {
        // Update existing business
        const updateResult = await updateBusiness(initialValues.id, values);
        if (updateResult.success) {
          toast.success('Business updated successfully!');
          navigate('/registered-business');
        } else {
          toast.error(`Failed to update business: ${updateResult.message}`);
        }
      } else {
        // Create new business
        const createResult = await createBusiness(values);
        if (createResult.success) {
          toast.success('Business registered successfully!');
          navigate('/registered-business');
        } else {
          toast.error(`Failed to register business: ${createResult.message}`);
        }
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [initialValues?.id, navigate]);

  return {
    form,
    activeTab,
    nextTab,
    prevTab,
    onSubmit,
    isSubmitting,
    setActiveTab
  };
};

export default useBusinessRegistration;
