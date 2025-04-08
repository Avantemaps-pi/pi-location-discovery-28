
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../formSchema';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';

const WalletAddressField = () => {
  const form = useFormContext<FormValues>();
  const { user, login } = useAuth();
  
  // If wallet address is available, use it as default
  React.useEffect(() => {
    if (user?.walletAddress && !form.getValues('piWalletAddress')) {
      form.setValue('piWalletAddress', user.walletAddress);
    }
  }, [user?.walletAddress, form]);
  
  const handleRequestPermission = async () => {
    await login();
  };
  
  return (
    <FormField
      control={form.control}
      name="piWalletAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base mb-1.5">Pi Wallet Address (Business)</FormLabel>
          <FormControl>
            <div className="space-y-2">
              <Input 
                placeholder="Your Pi wallet address" 
                {...field} 
              />
              {!user?.walletAddress && (
                <div className="flex flex-col space-y-2">
                  <p className="text-xs text-amber-600">
                    Wallet address permission not granted. 
                    You can log in to automatically populate this field.
                  </p>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleRequestPermission}
                    className="w-fit"
                  >
                    Request wallet address permission
                  </Button>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default WalletAddressField;
