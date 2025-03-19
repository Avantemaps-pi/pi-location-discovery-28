
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from 'react-hook-form';
import { FormValues, businessTypes } from './formSchema';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Types of Business (Select all that apply)</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {field.value?.length
                        ? `${field.value.length} type${field.value.length > 1 ? 's' : ''} selected`
                        : "Select business types"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search business types..." />
                    <CommandEmpty>No business type found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {businessTypes.map((type) => (
                        <CommandItem
                          value={type}
                          key={type}
                          onSelect={() => {
                            const current = field.value || [];
                            const isSelected = current.includes(type);
                            
                            if (isSelected) {
                              field.onChange(current.filter(value => value !== type));
                            } else {
                              field.onChange([...current, type]);
                            }
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value?.includes(type) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {type}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
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
