
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { FormValues, businessTypes } from '../formSchema';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BusinessTypeSelectorProps {
  disabled?: boolean;
}

const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({ disabled }) => {
  const form = useFormContext<FormValues>();
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  
  return (
    <FormField
      control={form.control}
      name="businessTypes"
      render={({ field }) => {
        // Ensure field.value is always an array
        const values = Array.isArray(field.value) ? field.value : [];
        
        // Sync internal state with form values when component mounts or field.value changes
        React.useEffect(() => {
          setSelectedTypes(values);
        }, [values]);
        
        const handleSelectType = (type: string) => {
          // Don't add if already selected
          if (selectedTypes.includes(type)) return;
          
          const newSelectedTypes = [...selectedTypes, type];
          setSelectedTypes(newSelectedTypes);
          field.onChange(newSelectedTypes);
        };
        
        const handleRemoveType = (typeToRemove: string) => {
          const newSelectedTypes = selectedTypes.filter(
            (type) => type !== typeToRemove
          );
          setSelectedTypes(newSelectedTypes);
          field.onChange(newSelectedTypes);
        };
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel className="text-base mb-1.5 whitespace-nowrap">Business type (Select all that apply)</FormLabel>
            <div className="space-y-4">
              {/* Selected types badges */}
              {selectedTypes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="secondary"
                      className="px-2 py-1.5 gap-1 text-sm"
                    >
                      {type}
                      {!disabled && (
                        <button
                          type="button"
                          className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                          onClick={() => handleRemoveType(type)}
                          disabled={disabled}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Type selector dropdown */}
              <FormControl>
                <Select onValueChange={handleSelectType} disabled={disabled}>
                  <SelectTrigger 
                    className={cn(
                      "w-full",
                      !selectedTypes.length && "text-muted-foreground"
                    )}
                  >
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    align="start"
                    className="max-h-[300px] overflow-y-auto z-50"
                    sideOffset={4}
                  >
                    {businessTypes
                      .filter(type => !selectedTypes.includes(type))
                      .map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          disabled={selectedTypes.includes(type) || disabled}
                        >
                          {type}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default BusinessTypeSelector;
