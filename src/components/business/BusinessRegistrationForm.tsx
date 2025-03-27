
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

// Import the form schema and components
import { formSchema, FormValues } from './registration/formSchema';
import BusinessOwnerTab from './registration/BusinessOwnerTab';
import ContactTab from './registration/ContactTab';
import AddressTab from './registration/AddressTab';
import HoursTab from './registration/HoursTab';
import DetailsTab from './registration/DetailsTab';
import TabNavigation from './registration/components/TabNavigation';
import TabContent from './registration/components/TabContent';

interface BusinessRegistrationFormProps {
  onSuccess?: () => void;
}

const BusinessRegistrationForm = ({ onSuccess }: BusinessRegistrationFormProps) => {
  const isMobile = useIsMobile();
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
      businessTypes: [], // Initialize as empty array, not undefined
      businessDescription: '',
      piWalletAddress: '',
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

  const [selectedTab, setSelectedTab] = React.useState('business-owner');
  const [selectedImage, setSelectedImage] = React.useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const onSubmit = (values: FormValues) => {
    console.log('Form values:', values);
    console.log('Selected image:', selectedImage);
    
    toast.success('Business registration submitted successfully!');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="w-full py-2">
      <div className="mb-6 md:mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Register Business</h2>
        <p className="text-muted-foreground text-lg mt-2">
          List your business on Avante Maps.
        </p>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-4xl mx-auto">
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
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default BusinessRegistrationForm;
