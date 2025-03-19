
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building } from 'lucide-react';

const EmptyBusinessState = () => {
  return (
    <Card className="text-center py-12">
      <CardContent>
        <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">No Businesses Registered</h3>
        <p className="text-muted-foreground mb-6">You haven't registered any businesses yet.</p>
        <Button onClick={() => window.location.href = '/registration'}>Register a Business</Button>
      </CardContent>
    </Card>
  );
};

export default EmptyBusinessState;
