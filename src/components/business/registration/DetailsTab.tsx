import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from 'react-hook-form';
import { FormValues, businessTypes } from './formSchema';
import { useIsMobile } from '@/hooks/use-mobile';
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
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-4 space-y-2">
        <CardTitle className="text-2xl sm:text-xl">Additional Details</CardTitle>
        <CardDescription className="text-base sm:text-sm">
          Tell customers more about your business.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormField
          control={form.control}
          name="businessTypes"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-base mb-1.5">Types of Business (Select all that apply)</FormLabel>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className={cn(
                        "w-full justify-between",
                        !field.value?.length && "text-muted-foreground"
                      )}
                    >
                      {(field.value || []).length
                        ? `${(field.value || []).length} type${(field.value || []).length > 1 ? 's' : ''} selected`
                        : "Select business types"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent 
                  className={cn(
                    "w-full max-w-[350px] p-0",
                    isMobile ? "max-w-[calc(100vw-2rem)]" : ""
                  )} 
                  align="start"
                  side="bottom"
                  sideOffset={5}
                >
                  <Command className="bg-popover">
                    <CommandInput placeholder="Search business types..." className="h-11" />
                    <CommandEmpty>No business type found.</CommandEmpty>
                    <CommandGroup>
                      <ScrollArea className="h-60 max-h-[50vh]">
                        {businessTypes.map((type) => (
                          <CommandItem
                            key={type}
                            value={type}
                            onSelect={() => {
                              const current = field.value || [];
                              const isSelected = current.includes(type);
                              
                              const newValue = isSelected
                                ? current.filter(value => value !== type)
                                : [...current, type];
                                
                              field.onChange(newValue);
                            }}
                            className="flex items-center gap-2 py-3"
                          >
                            <div className={cn(
                              "flex h-5 w-5 items-center justify-center rounded-sm border border-primary",
                              (field.value || []).includes(type) ? "bg-primary text-primary-foreground" : "opacity-50"
                            )}>
                              {(field.value || []).includes(type) && (
                                <Check className="h-4 w-4" />
                              )}
                            </div>
                            <span className="text-base sm:text-sm">{type}</span>
                          </CommandItem>
                        ))}
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
          <FormLabel className="text-base mb-1.5">Business Image</FormLabel>
          <FormControl>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              className="cursor-pointer"
            />
          </FormControl>
          <FormDescription className="text-sm mt-1.5">
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
      </CardContent>
      <CardFooter className="flex justify-between pt-2 flex-wrap gap-3">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
          className="min-w-24"
        >
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-avante-blue hover:bg-avante-blue/90 min-w-40"
        >
          Submit Registration
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DetailsTab;
