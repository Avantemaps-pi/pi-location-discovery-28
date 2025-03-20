
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
import { ScrollArea } from '@/components/ui/scroll-area';

interface DetailsTabProps {
  onPrevious: () => void;
  selectedImage: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({ onPrevious, selectedImage, handleImageUpload }) => {
  const form = useFormContext<FormValues>();
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Additional Details</CardTitle>
        <CardDescription>
          Tell customers more about your business.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search business types..." />
                    <CommandEmpty>No business type found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-60">
                        <div>
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
                              className="flex items-center gap-2"
                            >
                              <div className={cn(
                                "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                field.value?.includes(type) ? "bg-primary text-primary-foreground" : "opacity-50"
                              )}>
                                {field.value?.includes(type) && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                              <span>{type}</span>
                            </CommandItem>
                          ))}
                        </div>
                      </ScrollArea>
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
              className="cursor-pointer"
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
                  className="min-h-[120px] resize-none"
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
      <CardFooter className="flex justify-between pt-2">
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
