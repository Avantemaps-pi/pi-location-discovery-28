
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building, Edit, MapPin, Clock, Shield, AlertTriangle } from 'lucide-react';

const RegisteredBusiness = () => {
  const businesses = [
    {
      id: 1,
      name: "Pi Cafe",
      address: "123 Main St, San Francisco, CA",
      description: "A cozy cafe serving coffee and pastries. We accept Pi payments for all items.",
      isCertified: false
    },
    {
      id: 2,
      name: "Pi Tech Repairs",
      address: "456 Market St, San Francisco, CA",
      description: "Computer and phone repair services. Quick and reliable, accepting Pi cryptocurrency.",
      isCertified: false
    }
  ];

  return (
    <AppLayout title="My Registered Businesses">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">My Registered Businesses</h1>
            <p className="text-muted-foreground mt-1">Manage your Pi-accepting businesses</p>
          </div>
          <Button onClick={() => window.location.href = '/registration'}>Register New Business</Button>
        </div>

        {businesses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">No Businesses Registered</h3>
              <p className="text-muted-foreground mb-6">You haven't registered any businesses yet.</p>
              <Button onClick={() => window.location.href = '/registration'}>Register a Business</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {businesses.map((business) => (
              <Card key={business.id} className="overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-100 md:col-span-1 aspect-video md:aspect-auto flex items-center justify-center">
                    <div className="text-center p-4">
                      <Building className="h-12 w-12 text-gray-400 mx-auto" />
                      <span className="block mt-2 text-sm text-muted-foreground">Business Image</span>
                    </div>
                  </div>
                  
                  <div className="p-6 md:col-span-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-bold">{business.name}</h2>
                        <div className="flex items-center mt-1 text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{business.address}</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                    
                    <p className="mt-4 text-gray-700">{business.description}</p>
                    
                    <div className="mt-6 space-y-3">
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium">Certification Status</span>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Not Certified
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-gray-500" />
                        <div>
                          <span className="text-sm font-medium">Registration Date</span>
                          <p className="text-sm text-muted-foreground">July 15, 2023</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 flex flex-wrap gap-2">
                      <Button>View Details</Button>
                      <Button variant="outline">Preview Listing</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default RegisteredBusiness;
