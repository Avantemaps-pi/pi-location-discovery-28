
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFormContext } from 'react-hook-form';
import { FormValues, daysOfWeek } from './formSchema';
import { CheckedState } from "@radix-ui/react-checkbox";

interface HoursTabProps {
  onNext: () => void;
  onPrevious: () => void;
}

const HoursTab: React.FC<HoursTabProps> = ({ onNext, onPrevious }) => {
  const form = useFormContext<FormValues>();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Trading Hours</CardTitle>
        <CardDescription>
          Let customers know when your business is open.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {daysOfWeek.map((day) => (
            <div key={day.name} className="grid grid-cols-[1fr_auto_1fr_1fr] gap-2 items-center">
              <div className="font-medium w-24">{day.name}</div>
              
              <FormField
                control={form.control}
                name={day.closed}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked: CheckedState) => {
                          field.onChange(checked === true);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm">Closed</FormLabel>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={day.open}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={form.watch(day.closed) === true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name={day.close}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="time"
                        {...field}
                        disabled={form.watch(day.closed) === true}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button 
          type="button" 
          className="bg-avante-blue hover:bg-avante-blue/90"
          onClick={onNext}
        >
          Next
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HoursTab;
