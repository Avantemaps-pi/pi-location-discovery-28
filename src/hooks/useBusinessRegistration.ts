
import { useState, useCallback } from 'react';
import { FormValues } from '@/components/business/registration/formSchema';
import { createBusiness } from '@/api/business';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useBusinessFormInit } from './business/useBusinessFormInit';
import { useBusinessImages } from './business/useBusinessImages';
import { useTabNavigation } from './business/useTabNavigation';

export const useBusinessRegistration = (onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const form = useBusinessFormInit();
  const { selectedImages, handleImageUpload, handleImageRemove } = useBusinessImages();
  const { activeTab, setActiveTab, nextTab, prevTab } = useTabNavigation();

  const onSubmit = useCallback(async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const result = await createBusiness(values);
      if (result.success) {
        toast.success('Business registered successfully!');
        if (onSuccess) onSuccess();
        navigate('/registered-business');
      } else {
        toast.error(`Failed to register business: ${result.message || 'Unknown error'}`);
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

