
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../formSchema';

const WalletAddressField = () => {
  const form = useFormContext<FormValues>();
  
  return (
    <FormField
      control={form.control}
      name="piWalletAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base mb-1.5">Pi Wallet Address (Business)</FormLabel>
          <FormControl>
            <Input 
              placeholder="Your Pi wallet address" 
              {...field} 
            />
          </FormControl>
          <FormDescription className="text-sm mt-1.5">
            This is where customers will send Pi payments
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WalletAddressField;
