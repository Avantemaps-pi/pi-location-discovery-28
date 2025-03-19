
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const businessTypes = [
  'Restaurant/Cafe',
  'Retail Store',
  'Technology',
  'Professional Services',
  'Health & Wellness',
  'Entertainment',
  'Education',
  'Accommodation',
  'Other',
];

const formSchema = z.object({
  // Business Owner
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  businessName: z.string().min(2, { message: 'Business name is required' }),
  
  // Contact Details
  phone: z.string().min(10, { message: 'Valid phone number is required' }),
  email: z.string().email({ message: 'Valid email address is required' }),
  website: z.string().url({ message: 'Valid URL is required' }).optional().or(z.literal('')),
  
  // Physical Address
  streetAddress: z.string().min(5, { message: 'Street address is required' }),
  apartment: z.string().optional(),
  state: z.string().min(2, { message: 'State is required' }),
  zipCode: z.string().min(5, { message: 'Valid zip/postal code is required' }),
  
  // Additional Details
  businessType: z.string({ required_error: 'Please select a business type' }),
  businessDescription: z.string().min(10, { message: 'Please provide a short description' }),
  piWalletAddress: z.string().min(5, { message: 'Pi wallet address is required' }),
  
  // Trading Hours
  mondayOpen: z.string().optional(),
  mondayClose: z.string().optional(),
  mondayClosed: z.boolean().optional(),
  
  tuesdayOpen: z.string().optional(),
  tuesdayClose: z.string().optional(),
  tuesdayClosed: z.boolean().optional(),
  
  wednesdayOpen: z.string().optional(),
  wednesdayClose: z.string().optional(),
  wednesdayClosed: z.boolean().optional(),
  
  thursdayOpen: z.string().optional(),
  thursdayClose: z.string().optional(),
  thursdayClosed: z.boolean().optional(),
  
  fridayOpen: z.string().optional(),
  fridayClose: z.string().optional(),
  fridayClosed: z.boolean().optional(),
  
  saturdayOpen: z.string().optional(),
  saturdayClose: z.string().optional(),
  saturdayClosed: z.boolean().optional(),
  
  sundayOpen: z.string().optional(),
  sundayClose: z.string().optional(),
  sundayClosed: z.boolean().optional(),
});

interface BusinessRegistrationFormProps {
  onSuccess?: () => void;
}

const BusinessRegistrationForm = ({ onSuccess }: BusinessRegistrationFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, this would send the form data along with the image to a backend service
    console.log('Form values:', values);
    console.log('Selected image:', selectedImage);
    
    toast.success('Business registration submitted successfully!');
    if (onSuccess) onSuccess();
  };

  // Define the days of the week with type-safe field names
  const daysOfWeek = [
    { name: 'Monday', open: 'mondayOpen' as const, close: 'mondayClose' as const, closed: 'mondayClosed' as const },
    { name: 'Tuesday', open: 'tuesdayOpen' as const, close: 'tuesdayClose' as const, closed: 'tuesdayClosed' as const },
    { name: 'Wednesday', open: 'wednesdayOpen' as const, close: 'wednesdayClose' as const, closed: 'wednesdayClosed' as const },
    { name: 'Thursday', open: 'thursdayOpen' as const, close: 'thursdayClose' as const, closed: 'thursdayClosed' as const },
    { name: 'Friday', open: 'fridayOpen' as const, close: 'fridayClose' as const, closed: 'fridayClosed' as const },
    { name: 'Saturday', open: 'saturdayOpen' as const, close: 'saturdayClose' as const, closed: 'saturdayClosed' as const },
    { name: 'Sunday', open: 'sundayOpen' as const, close: 'sundayClose' as const, closed: 'sundayClosed' as const },
  ];

  return (
    <div className="py-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">Register Your Business</h2>
        <p className="text-muted-foreground">
          List your business as a Pi-accepting merchant on Avante Maps.
        </p>
      </div>

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
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Business Owner Information</CardTitle>
                  <CardDescription>
                    Enter the details of the business owner or manager.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Pi Tech Store" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    type="button" 
                    className="ml-auto bg-avante-blue hover:bg-avante-blue/90"
                    onClick={() => setSelectedTab('contact')}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Contact Details</CardTitle>
                  <CardDescription>
                    How customers can reach your business.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 123-4567" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="contact@business.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://yourbusiness.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedTab('business-owner')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-avante-blue hover:bg-avante-blue/90"
                    onClick={() => setSelectedTab('address')}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Physical Address</CardTitle>
                  <CardDescription>
                    Where your business is located.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input placeholder="123 Business Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="apartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apartment / Complex (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Suite 101" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input placeholder="California" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="zipCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal / Zip Code</FormLabel>
                          <FormControl>
                            <Input placeholder="94103" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedTab('contact')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-avante-blue hover:bg-avante-blue/90"
                    onClick={() => setSelectedTab('hours')}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Trading Hours Tab */}
            <TabsContent value="hours" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Trading Hours</CardTitle>
                  <CardDescription>
                    Let customers know when your business is open.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {daysOfWeek.map((day) => (
                      <div key={day.name} className="grid grid-cols-[1fr_auto_1fr_1fr] gap-2 items-center">
                        <div className="font-medium w-24">{day.name}</div>
                        
                        <FormField
                          control={form.control}
                          name={day.closed}
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked === true);
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm">Closed</FormLabel>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={day.open}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  disabled={form.watch(day.closed) === true}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={day.close}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="time"
                                  {...field}
                                  disabled={form.watch(day.closed) === true}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedTab('address')}
                  >
                    Back
                  </Button>
                  <Button 
                    type="button" 
                    className="bg-avante-blue hover:bg-avante-blue/90"
                    onClick={() => setSelectedTab('details')}
                  >
                    Next
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Additional Details</CardTitle>
                  <CardDescription>
                    Tell customers more about your business.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Business</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a business type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {businessTypes.map((type) => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormItem>
                    <FormLabel>Business Image</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload an image of your business or logo
                    </FormDescription>
                    {selectedImage && (
                      <div className="mt-2">
                        <p className="text-sm">Selected: {selectedImage.name}</p>
                      </div>
                    )}
                  </FormItem>
                  
                  <FormField
                    control={form.control}
                    name="businessDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your business..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="piWalletAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pi Wallet Address (Business)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your Pi wallet address" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          This is where customers will send Pi payments
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setSelectedTab('hours')}
                  >
                    Back
                  </Button>
                  <Button type="submit" className="bg-avante-blue hover:bg-avante-blue/90">
                    Submit Registration
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
};

export default BusinessRegistrationForm;
