
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import GoogleMap from '@/components/map/GoogleMap';
import SearchBar from '@/components/map/SearchBar';
import BusinessRegistrationForm from '@/components/business/BusinessRegistrationForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const Index = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <AppLayout fullHeight withHeader title="Avante Maps">
      <div className="relative h-full w-full">
        {/* Map Container */}
        <div className="h-full w-full">
          <GoogleMap />
        </div>
        
        {/* Search Bar overlaid on map */}
        <div className="absolute top-4 left-4 z-10 w-full max-w-md px-4 md:px-0">
          <SearchBar />
        </div>

        {/* Add Business Button */}
        <div className="absolute bottom-6 right-6 z-10">
          <Sheet open={isFormOpen} onOpenChange={setIsFormOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full shadow-lg bg-avante-blue hover:bg-avante-blue/90">
                <Plus className="mr-2 h-5 w-5" />
                Add Business
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
              <BusinessRegistrationForm onSuccess={() => setIsFormOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
