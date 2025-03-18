
import { Loader2 } from 'lucide-react';
import { Status } from '@googlemaps/react-wrapper';

// Loading spinner
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center w-full h-full">
    <Loader2 className="h-12 w-12 text-avante-blue animate-spin" />
  </div>
);

// Error message
export const ErrorMessage = () => (
  <div className="flex items-center justify-center w-full h-full bg-red-50">
    <div className="text-center p-4">
      <p className="text-red-600 text-lg font-semibold">Error loading Google Maps</p>
      <p className="text-red-500">Please check your connection and try again</p>
    </div>
  </div>
);

// Render state based on status
export const renderMap = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return <LoadingSpinner />;
    case Status.FAILURE:
      return <ErrorMessage />;
    default:
      return <LoadingSpinner />;
  }
};
