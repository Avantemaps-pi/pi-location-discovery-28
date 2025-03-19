
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import { FormValues, businessTypes } from './formSchema';

interface DetailsTabProps {
  onPrevious: () => void;
  selectedImage: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ onPrevious, selectedImage, handleImageUpload }) => {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Additional Details</CardTitle>
        <CardDescription>
          Tell customers more about your business.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="businessTypes"
          render={() => (
            <FormItem>
              <FormLabel>Types of Business (Select all that apply)</FormLabel>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {businessTypes.map((type) => (
                  <FormField
                    key={type}
                    control={form.control}
                    name="businessTypes"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={type}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(type)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                return checked
                                  ? field.onChange([...current, type])
                                  : field.onChange(
                                      current.filter((value) => value !== type)
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {type}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormItem>
          <FormLabel>Business Image</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </FormControl>
          <FormDescription>
            Upload an image of your business or logo
          </FormDescription>
          {selectedImage && (
            <div className="mt-2">
              <p className="text-sm">Selected: {selectedImage.name}</p>
            </div>
          )}
        </FormItem>
        
        <FormField
          control={form.control}
          name="businessDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell us about your business..." 
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="piWalletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pi Wallet Address (Business)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Your Pi wallet address" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                This is where customers will send Pi payments
              </FormDescription>
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
        <Button type="submit" className="bg-avante-blue hover:bg-avante-blue/90">
          Submit Registration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailsTab;
