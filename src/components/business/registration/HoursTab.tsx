
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
        <div className="max-h-[450px] overflow-y-auto pr-2">
          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_60px_1fr_1fr] gap-3 items-center mb-2 font-medium">
              <div>Day</div>
              <div className="text-center">Closed</div>
              <div>Opening</div>
              <div>Closing</div>
            </div>
            {daysOfWeek.map((day) => (
              <div key={day.name} className="grid grid-cols-[1fr_60px_1fr_1fr] gap-3 items-center">
                <div className="font-medium">{day.name}</div>
                
                <FormField
                  control={form.control}
                  name={day.closed}
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked: CheckedState) => {
                            field.onChange(checked === true);
                          }}
                        />
                      </FormControl>
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
                          className="w-full"
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
                          className="w-full"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
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
