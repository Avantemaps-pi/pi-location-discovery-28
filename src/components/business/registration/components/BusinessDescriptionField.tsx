
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../formSchema';

const BusinessDescriptionField = () => {
  const form = useFormContext<FormValues>();
  
  return (
    <FormField
      control={form.control}
      name="businessDescription"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base mb-1.5">Business Description</FormLabel>
          <FormControl>
            <Textarea 
              placeholder="Tell us about your business..." 
              className="min-h-[120px] resize-none text-base md:text-sm"
              {...field} 
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default BusinessDescriptionField;
