
import * as z from 'zod';

// Define the schema for business registration form
export const formSchema = z.object({
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
  businessTypes: z.array(z.string()).min(1, { message: 'Please select at least one business type' }),
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

export type FormValues = z.infer<typeof formSchema>;

// Define the business types
export const businessTypes = [
  'Restaurant/Cafe',
  'Retail Store',
  'Technology',
  'Professional Services',
  'Health & Wellness',
  'Entertainment',
  'Education',
  'Accommodation',
  'Transportation',
  'Financial Services',
  'Arts & Crafts',
  'Agriculture',
  'Construction',
  'Manufacturing',
  'Real Estate',
  'Other',
];

// Define days of the week with type-safe field names
export const daysOfWeek = [
  { name: 'Monday', open: 'mondayOpen' as const, close: 'mondayClose' as const, closed: 'mondayClosed' as const },
  { name: 'Tuesday', open: 'tuesdayOpen' as const, close: 'tuesdayClose' as const, closed: 'tuesdayClosed' as const },
  { name: 'Wednesday', open: 'wednesdayOpen' as const, close: 'wednesdayClose' as const, closed: 'wednesdayClosed' as const },
  { name: 'Thursday', open: 'thursdayOpen' as const, close: 'thursdayClose' as const, closed: 'thursdayClosed' as const },
  { name: 'Friday', open: 'fridayOpen' as const, close: 'fridayClose' as const, closed: 'fridayClosed' as const },
  { name: 'Saturday', open: 'saturdayOpen' as const, close: 'saturdayClose' as const, closed: 'saturdayClosed' as const },
  { name: 'Sunday', open: 'sundayOpen' as const, close: 'sundayClose' as const, closed: 'sundayClosed' as const },
];
