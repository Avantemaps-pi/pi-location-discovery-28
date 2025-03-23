
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFormContext } from 'react-hook-form';
import { FormValues } from './formSchema';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Extended country codes list
const countryCodes = [
  { code: '+1', country: 'US/Canada' },
  { code: '+44', country: 'UK' },
  { code: '+61', country: 'Australia' },
  { code: '+64', country: 'New Zealand' },
  { code: '+33', country: 'France' },
  { code: '+49', country: 'Germany' },
  { code: '+81', country: 'Japan' },
  { code: '+86', country: 'China' },
  { code: '+91', country: 'India' },
  { code: '+27', country: 'South Africa' },
  { code: '+52', country: 'Mexico' },
  { code: '+55', country: 'Brazil' },
  { code: '+34', country: 'Spain' },
  { code: '+39', country: 'Italy' },
  { code: '+7', country: 'Russia' },
  { code: '+82', country: 'South Korea' },
  { code: '+65', country: 'Singapore' },
  { code: '+60', country: 'Malaysia' },
  { code: '+31', country: 'Netherlands' },
  { code: '+47', country: 'Norway' },
  { code: '+46', country: 'Sweden' },
  { code: '+45', country: 'Denmark' },
  { code: '+971', country: 'UAE' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+351', country: 'Portugal' },
  { code: '+48', country: 'Poland' },
  { code: '+66', country: 'Thailand' },
  { code: '+84', country: 'Vietnam' },
  { code: '+62', country: 'Indonesia' },
  { code: '+254', country: 'Kenya' },
];

interface ContactTabProps {
  onNext: () => void;
  onPrevious: () => void;
}

const ContactTab: React.FC<ContactTabProps> = ({ onNext, onPrevious }) => {
  const form = useFormContext<FormValues>();
  const [countryCode, setCountryCode] = React.useState('+1');

  // Handle phone input to only allow numbers
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Replace any non-numeric character with empty string
    const numericValue = value.replace(/[^0-9]/g, '');
    form.setValue('phone', numericValue);
  };

  return (
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
              <div className="flex space-x-2">
                <Select
                  value={countryCode}
                  onValueChange={setCountryCode}
                >
                  <SelectTrigger className="w-[80px] flex-shrink-0">
                    <SelectValue placeholder="+1" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {countryCodes.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.code} {country.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormControl>
                  <Input 
                    placeholder="555-123-4567"
                    {...field}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onChange={(e) => {
                      handlePhoneInput(e);
                    }}
                  />
                </FormControl>
              </div>
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
              <FormLabel>Pi Website URL (Optional)</FormLabel>
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
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button 
          type="button" 
          className="bg-avante-blue hover:bg-avante-blue/90"
          onClick={onNext}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ContactTab;
