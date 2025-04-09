
import React, { useState } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../formSchema';
import { useAuth } from '@/context/auth';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { isRunningInPiBrowser } from '@/utils/piNetwork/helpers';

const WalletAddressField = () => {
  const form = useFormContext<FormValues>();
  const { user, login, isLoading } = useAuth();
  const [isLoginAttempted, setIsLoginAttempted] = useState(false);
  const isPiBrowser = isRunningInPiBrowser();
  
  // If wallet address is available, use it as default
  React.useEffect(() => {
    if (user?.walletAddress && !form.getValues('piWalletAddress')) {
      form.setValue('piWalletAddress', user.walletAddress);
    }
  }, [user?.walletAddress, form]);
  
  const handleRequestPermission = async () => {
    setIsLoginAttempted(true);
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
                  {!isPiBrowser && (
                    <Alert variant="warning" className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-xs text-amber-600">
                        You're not using Pi Browser. To auto-fill your Pi wallet address, 
                        please open this page in the Pi Browser app.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {isPiBrowser && isLoginAttempted && !user?.walletAddress && !isLoading && (
                    <Alert variant="warning" className="bg-amber-50 border-amber-200">
                      <AlertCircle className="h-4 w-4 text-amber-600" />
                      <AlertDescription className="text-xs text-amber-600">
                        Wallet address permission was not granted. Please try again and 
                        make sure to accept all permission requests.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleRequestPermission}
                    className="w-fit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Requesting..." : "Request wallet address permission"}
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
