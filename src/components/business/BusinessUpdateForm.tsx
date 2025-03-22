import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { Form } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Business } from '@/types/business';

// Import the form schema and components
import { formSchema, FormValues } from './registration/formSchema';
import BusinessOwnerTab from './registration/BusinessOwnerTab';
import ContactTab from './registration/ContactTab';
import AddressTab from './registration/AddressTab';
import HoursTab from './registration/HoursTab';
import UpdateDetailsTab from './registration/UpdateDetailsTab';

interface BusinessUpdateFormProps {
  business: Business;
  onSuccess?: () => void;
}

export const BusinessUpdateForm = ({ business, onSuccess }: BusinessUpdateFormProps) => {
  const isMobile = useIsMobile();
  const [selectedTab, setSelectedTab] = useState('business-owner');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // Create default values based on the business data
  // In a real application, we would fetch complete data from an API
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: 'John', // Mock data
      lastName: 'Doe', // Mock data
      businessName: business.name,
      phone: '(123) 456-7890', // Mock data
      email: 'contact@example.com', // Mock data
      website: 'https://example.com', // Mock data
      streetAddress: business.address.split(',')[0] || '',
      apartment: '',
      state: business.address.split(',')[1]?.trim() || '',
      zipCode: business.address.split(',')[2]?.trim() || '',
      businessTypes: ['Restaurant/Cafe'], // Mock data
      businessDescription: business.description,
      piWalletAddress: 'pi1abcdefghijklmnopqrstuvwxyz', // Mock data
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
      <div className="mb-6 md:mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Update Business Information</h2>
        <p className="text-muted-foreground text-lg mt-2">
          Make changes to your business listing on Avante Maps.
        </p>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className={cn(
                "grid mb-6 w-full",
                isMobile ? "grid-cols-3 gap-1" : "grid-cols-5"
              )}>
                <TabsTrigger value="business-owner" className="text-sm whitespace-nowrap">
                  {isMobile ? "Owner" : "Business Owner"}
                </TabsTrigger>
                <TabsTrigger value="contact" className="text-sm">Contact</TabsTrigger>
                <TabsTrigger value="address" className="text-sm">Address</TabsTrigger>
                {isMobile && (
                  <div className="col-span-3 mt-1">
                    <TabsList className="grid grid-cols-2 w-full">
                      <TabsTrigger value="hours" className="text-sm">Hours</TabsTrigger>
                      <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                    </TabsList>
                  </div>
                )}
                {!isMobile && (
                  <>
                    <TabsTrigger value="hours" className="text-sm">Hours</TabsTrigger>
                    <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                  </>
                )}
              </TabsList>

              <div className="w-full">
                <TabsContent value="business-owner" className="space-y-4 w-full">
                  <BusinessOwnerTab onNext={() => setSelectedTab('contact')} />
                </TabsContent>

                <TabsContent value="contact" className="space-y-4 w-full">
                  <ContactTab 
                    onNext={() => setSelectedTab('address')} 
                    onPrevious={() => setSelectedTab('business-owner')} 
                  />
                </TabsContent>

                <TabsContent value="address" className="space-y-4 w-full">
                  <AddressTab 
                    onNext={() => setSelectedTab('hours')} 
                    onPrevious={() => setSelectedTab('contact')} 
                  />
                </TabsContent>

                <TabsContent value="hours" className="space-y-4 w-full">
                  <HoursTab 
                    onNext={() => setSelectedTab('details')} 
                    onPrevious={() => setSelectedTab('address')} 
                  />
                </TabsContent>

                <TabsContent value="details" className="space-y-4 w-full">
                  <UpdateDetailsTab 
                    onPrevious={() => setSelectedTab('hours')} 
                    selectedImage={selectedImage}
                    handleImageUpload={handleImageUpload}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
};

const UpdateDetailsTab = ({ 
  onPrevious, 
  selectedImage, 
  handleImageUpload 
}: { 
  onPrevious: () => void;
  selectedImage: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  const form = useForm();
  
  return (
    <div className="border shadow-sm rounded-lg">
      <div className="p-6 pb-4 space-y-2">
        <h3 className="text-2xl sm:text-xl font-semibold">Additional Details</h3>
        <p className="text-base sm:text-sm text-muted-foreground">
          Tell customers more about your business.
        </p>
      </div>
      <div className="p-6 pt-0 space-y-6">
        <p className="text-sm text-muted-foreground">Business details fields go here...</p>
      </div>
      <div className="p-6 pt-2 flex justify-between flex-wrap gap-3 border-t">
        <button
          type="button" 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base sm:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-12 sm:h-10 px-5 sm:px-4 py-3 sm:py-2 min-w-24"
          onClick={onPrevious}
        >
          Back
        </button>
        <button 
          type="submit" 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-base sm:text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-avante-blue hover:bg-avante-blue/90 text-primary-foreground h-12 sm:h-10 px-5 sm:px-4 py-3 sm:py-2 min-w-40"
        >
          Update Business Information
        </button>
      </div>
    </div>
  );
};
