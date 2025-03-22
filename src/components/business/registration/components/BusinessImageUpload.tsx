
import React from 'react';
import { FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface BusinessImageUploadProps {
  selectedImage: File | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const BusinessImageUpload: React.FC<BusinessImageUploadProps> = ({ 
  selectedImage, 
  handleImageUpload 
}) => {
  return (
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
  );
};

export default BusinessImageUpload;
