
import React from 'react';
import { Tabs } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { useBusinessRegistration } from '@/hooks/useBusinessRegistration';
import FormContainer from './registration/components/FormContainer';
import TabNavigation from './registration/components/TabNavigation';
import TabContent from './registration/components/TabContent';

interface BusinessRegistrationFormProps {
  onSuccess?: () => void;
}

const BusinessRegistrationForm = ({ onSuccess }: BusinessRegistrationFormProps) => {
  const isMobile = useIsMobile();
  const { form, selectedImage, handleImageUpload, onSubmit } = useBusinessRegistration(onSuccess);
  const [selectedTab, setSelectedTab] = React.useState('business-owner');

  return (
    <div className="w-full py-2 min-h-[600px]">
      <div className="mb-6 md:mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Register Business</h2>
        <p className="text-muted-foreground text-lg mt-2">
          List your business on Avante Maps.
        </p>
      </div>

      <FormContainer form={form} onSubmit={onSubmit}>
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
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
        </Tabs>
      </FormContainer>
    </div>
  );
};

export default BusinessRegistrationForm;
