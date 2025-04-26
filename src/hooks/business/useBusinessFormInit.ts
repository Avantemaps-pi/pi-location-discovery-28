
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/components/business/registration/formSchema';
import { Business } from '@/types/business';

export const useBusinessFormInit = (initialValues?: Business) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      businessName: initialValues?.name || '',
      countryCode: '+1',
      phone: initialValues?.phone || '',
      email: initialValues?.email || '',
      website: initialValues?.website || '',
      streetAddress: initialValues?.streetAddress || '',
      apartment: initialValues?.apartment || '',
      city: initialValues?.city || '',
      state: initialValues?.state || '',
      zipCode: initialValues?.zipCode || '',
      businessTypes: [],
      businessDescription: initialValues?.description || '',
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
    mode: 'onChange',
  });

  return form;
};

