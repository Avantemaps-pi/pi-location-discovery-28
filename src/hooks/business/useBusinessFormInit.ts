
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, FormValues } from '@/components/business/registration/formSchema';
import { Business } from '@/types/business';

export const useBusinessFormInit = (initialValues?: Business) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description || '',
      category: initialValues?.category || '',
      website: initialValues?.website || '',
      email: initialValues?.email || '',
      phone: initialValues?.phone || '',
      streetAddress: initialValues?.streetAddress || '',
      apartment: initialValues?.apartment || '',
      city: initialValues?.city || '',
      state: initialValues?.state || '',
      zipCode: initialValues?.zipCode || '',
      acceptsPi: initialValues?.acceptsPi !== undefined ? initialValues.acceptsPi : false,
      businessHours: initialValues?.businessHours || '',
      images: initialValues?.images || [],
      ownerId: initialValues?.ownerId || '',
      location: initialValues?.location || { type: 'Point', coordinates: [0, 0] },
      placeId: initialValues?.placeId || '',
      formattedAddress: initialValues?.formattedAddress || '',
    },
    mode: 'onChange',
  });

  return form;
};
