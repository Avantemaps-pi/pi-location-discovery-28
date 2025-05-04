
import { FormValues } from '@/components/business/registration/formSchema';

export const formatBusinessData = (values: FormValues, coordinates: google.maps.LatLngLiteral, userId: string) => {
  const fullAddress = `${values.streetAddress}, ${values.state}, ${values.zipCode}`;
  
  return {
    name: values.businessName,
    owner_id: userId,
    location: fullAddress,
    description: values.businessDescription,
    category: values.businessTypes.length > 0 ? values.businessTypes[0] : 'Other',
    coordinates: JSON.stringify(coordinates),
    contact_info: {
      phone: values.phone,
      email: values.email,
      website: values.website,
    },
    hours: {
      monday: values.mondayClosed ? 'Closed' : `${values.mondayOpen}-${values.mondayClose}`,
      tuesday: values.tuesdayClosed ? 'Closed' : `${values.tuesdayOpen}-${values.tuesdayClose}`,
      wednesday: values.wednesdayClosed ? 'Closed' : `${values.wednesdayOpen}-${values.wednesdayClose}`,
      thursday: values.thursdayClosed ? 'Closed' : `${values.thursdayOpen}-${values.thursdayClose}`,
      friday: values.fridayClosed ? 'Closed' : `${values.fridayOpen}-${values.fridayClose}`,
      saturday: values.saturdayClosed ? 'Closed' : `${values.saturdayOpen}-${values.saturdayClose}`,
      sunday: values.sundayClosed ? 'Closed' : `${values.sundayOpen}-${values.sundayClose}`,
    },
    business_types: values.businessTypes,
    pi_wallet_address: values.piWalletAddress,
    keywords: [...values.businessTypes, ...values.businessName.split(' ')].flat(),
  };
};
