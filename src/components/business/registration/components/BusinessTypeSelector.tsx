
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from "lucide-react";
import { useFormContext } from 'react-hook-form';
import { FormValues, businessTypes } from '../formSchema';
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

const BusinessTypeSelector = () => {
  const form = useFormContext<FormValues>();
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();
  
  return (
    <FormField
      control={form.control}
      name="businessTypes"
      render={({ field }) => {
        // Ensure field.value is always an array to avoid "undefined is not iterable" error
        const values = Array.isArray(field.value) ? field.value : [];
        
        return (
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
                      !values.length && "text-muted-foreground"
                    )}
                    type="button" // Explicitly set button type to prevent form submission
                    onClick={(e) => {
                      e.preventDefault(); // Prevent default behavior
                      e.stopPropagation(); // Stop event propagation
                      setOpen(!open); // Manually toggle the popover
                    }}
                  >
                    {values.length > 0
                      ? `${values.length} type${values.length > 1 ? 's' : ''} selected`
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
                  <CommandGroup className="overflow-hidden">
                    <ScrollArea className="h-60 max-h-[50vh]">
                      {businessTypes.map((type) => (
                        <CommandItem
                          key={type}
                          value={type}
                          onSelect={() => {
                            const isSelected = values.includes(type);
                            
                            const newValue = isSelected
                              ? values.filter(value => value !== type)
                              : [...values, type];
                              
                            field.onChange(newValue);
                          }}
                          className="flex items-center gap-2 py-3"
                        >
                          <div className={cn(
                            "flex h-5 w-5 items-center justify-center rounded-sm border border-primary",
                            values.includes(type) 
                              ? "bg-primary text-primary-foreground" 
                              : "opacity-50"
                          )}>
                            {values.includes(type) && (
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
        );
      }}
    />
  );
};

export default BusinessTypeSelector;
