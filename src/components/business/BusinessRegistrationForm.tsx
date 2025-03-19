
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

// Import the form schema and components
import { formSchema, FormValues } from './registration/formSchema';
import BusinessOwnerTab from './registration/BusinessOwnerTab';
import ContactTab from './registration/ContactTab';
import AddressTab from './registration/AddressTab';
import HoursTab from './registration/HoursTab';
import DetailsTab from './registration/DetailsTab';

interface BusinessRegistrationFormProps {
  onSuccess?: () => void;
}

const BusinessRegistrationForm = ({ onSuccess }: BusinessRegistrationFormProps) => {
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
      businessType: '',
      businessDescription: '',
      piWalletAddress: '',
      verificationStatus: 'Not Verified',
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
    // In a real app, this would send the form data along with the image to a backend service
    console.log('Form values:', values);
    console.log('Selected image:', selectedImage);
    
    toast.success('Business registration submitted successfully!');
    if (onSuccess) onSuccess();
  };

  return (
    <div className="py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Register Your Business</h2>
        <p className="text-muted-foreground">
          List your business as a Pi-accepting merchant on Avante Maps.
        </p>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="business-owner">Business Owner</TabsTrigger>
                <TabsTrigger value="contact">Contact</TabsTrigger>
                <TabsTrigger value="address">Address</TabsTrigger>
                <TabsTrigger value="hours">Hours</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Business Owner Tab */}
              <TabsContent value="business-owner" className="space-y-4">
                <BusinessOwnerTab onNext={() => setSelectedTab('contact')} />
              </TabsContent>

              {/* Contact Tab */}
              <TabsContent value="contact" className="space-y-4">
                <ContactTab 
                  onNext={() => setSelectedTab('address')} 
                  onPrevious={() => setSelectedTab('business-owner')} 
                />
              </TabsContent>

              {/* Address Tab */}
              <TabsContent value="address" className="space-y-4">
                <AddressTab 
                  onNext={() => setSelectedTab('hours')} 
                  onPrevious={() => setSelectedTab('contact')} 
                />
              </TabsContent>

              {/* Trading Hours Tab */}
              <TabsContent value="hours" className="space-y-4">
                <HoursTab 
                  onNext={() => setSelectedTab('details')} 
                  onPrevious={() => setSelectedTab('address')} 
                />
              </TabsContent>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <DetailsTab 
                  onPrevious={() => setSelectedTab('hours')} 
                  selectedImage={selectedImage}
                  handleImageUpload={handleImageUpload}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

export default BusinessRegistrationForm;
