
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import BusinessOwnerTab from '../BusinessOwnerTab';
import ContactTab from '../ContactTab';
import AddressTab from '../AddressTab';
import HoursTab from '../HoursTab';
import DetailsTab from '../DetailsTab';

interface TabContentProps {
  selectedImage: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedTab: (tab: string) => void;
}

const TabContent: React.FC<TabContentProps> = ({ 
  selectedImage, 
  handleImageUpload, 
  setSelectedTab 
}) => {
  return (
    <div className="w-full min-h-[500px]">
      <TabsContent value="business-owner" className="space-y-4 w-full">
        <BusinessOwnerTab onNext={() => setSelectedTab('contact')} />
      </TabsContent>

      <TabsContent value="contact" className="space-y-4 w-full">
        <ContactTab 
          onNext={() => setSelectedTab('address')} 
          onPrevious={() => setSelectedTab('business-owner')} 
        />
      </TabsContent>

      <TabsContent value="address" className="space-y-4 w-full">
        <AddressTab 
          onNext={() => setSelectedTab('hours')} 
          onPrevious={() => setSelectedTab('contact')} 
        />
      </TabsContent>

      <TabsContent value="hours" className="space-y-4 w-full">
        <HoursTab 
          onNext={() => setSelectedTab('details')} 
          onPrevious={() => setSelectedTab('address')} 
        />
      </TabsContent>

      <TabsContent value="details" className="space-y-4 w-full">
        <DetailsTab 
          onPrevious={() => setSelectedTab('hours')} 
          selectedImage={selectedImage}
          handleImageUpload={handleImageUpload}
        />
      </TabsContent>
    </div>
  );
};

export default TabContent;
