
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading businesses...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
