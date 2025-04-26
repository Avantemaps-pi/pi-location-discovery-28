
import { useState, useCallback } from 'react';
import { FormValues } from '@/components/business/registration/formSchema';
import { createBusiness, updateBusiness } from '@/api/business';
import { Business } from '@/types/business';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useBusinessFormInit } from './business/useBusinessFormInit';
import { useBusinessImages } from './business/useBusinessImages';

export const useBusinessRegistration = (onSuccess?: () => void) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useBusinessFormInit();
  const { selectedImages, handleImageUpload, handleImageRemove } = useBusinessImages();

  const nextTab = useCallback(() => {
    setActiveTab((current) => Math.min(current + 1, 3));
  }, []);

  const prevTab = useCallback(() => {
    setActiveTab((current) => Math.max(current - 1, 0));
  }, []);

  const onSubmit = useCallback(async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const createResult = await createBusiness(values);
      if (createResult.success) {
        toast.success('Business registered successfully!');
        if (onSuccess) onSuccess();
        navigate('/registered-business');
      } else {
        toast.error(`Failed to register business: ${createResult.message}`);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      toast.error(`Registration failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, onSuccess]);

  return {
    form,
    activeTab,
    nextTab,
    prevTab,
    onSubmit,
    isSubmitting,
    setActiveTab,
    selectedImages,
    handleImageUpload,
    handleImageRemove
  };
};
