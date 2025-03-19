
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface BusinessHeaderProps {
  title: string;
  subtitle?: string;
}

const BusinessHeader = ({ title, subtitle }: BusinessHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      <Button onClick={() => navigate('/registration')}>Register New Business</Button>
    </div>
  );
};

export default BusinessHeader;
