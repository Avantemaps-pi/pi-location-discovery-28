
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Info, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BusinessVerificationStatusProps {
  isCertification?: boolean;
}

const BusinessVerificationStatus = ({ isCertification = false }: BusinessVerificationStatusProps) => {
  return (
    <>
      {!isCertification ? (
        <div className="flex flex-col">
          <div className="flex items-center">
            <Shield className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-sm font-medium">Verification Status</span>
          </div>
          <div className="mt-1 flex flex-col">
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1 self-start mb-1">
              <AlertTriangle className="h-3 w-3" />
              Not Verified
            </Badge>
            <Button variant="link" size="sm" asChild className="pl-0 h-auto text-blue-600 self-start">
              <Link to="/verification-info">
                <Info className="h-3.5 w-3.5 mr-1" />
                <span className="text-xs">View Requirements</span>
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Not Certified
        </Badge>
      )}
    </>
  );
};

export default BusinessVerificationStatus;
