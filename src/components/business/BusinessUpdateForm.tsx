
import React, { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { Business } from '@/types/business';
import { FormValues } from './registration/formSchema';
import { useBusinessFormInit } from '@/hooks/useBusinessFormInit';
import FormHeader from './registration/components/FormHeader';
import TabNavigation from './registration/components/TabNavigation';
import TabContent from './registration/components/TabContent';

interface BusinessUpdateFormProps {
  business: Business;
  onSuccess?: () => void;
}

export const BusinessUpdateForm = ({ business, onSuccess }: BusinessUpdateFormProps) => {
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState('business-owner');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const form = useBusinessFormInit(business);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = (values: FormValues) => {
    // In a real app, this would send the form data along with the image to a backend service
    console.log('Updated form values:', values);
    console.log('Selected image:', selectedImage);
    
    toast.success('Business information updated successfully!');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="w-full py-2">
      <FormHeader 
        title="Update Information"
        description="Make changes to your business listing on Avante Maps."
      />

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <TabNavigation 
              isMobile={isMobile} 
              value={selectedTab} 
              onValueChange={setSelectedTab} 
            />
            <TabContent 
              selectedImage={selectedImage}
              handleImageUpload={handleImageUpload}
              setSelectedTab={setSelectedTab}
            />
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};
