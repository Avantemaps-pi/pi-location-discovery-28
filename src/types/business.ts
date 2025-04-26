
export interface Business {
  id: number;
  name: string;
  address: string;
  description: string;
  isCertified: boolean;
  ownerId?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  images?: string[];
  placeId?: string;
  formattedAddress?: string;
  category?: string;
  website?: string;
  email?: string;
  phone?: string;
  streetAddress?: string;
  apartment?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  acceptsPi?: boolean;
  businessHours?: string;
}
