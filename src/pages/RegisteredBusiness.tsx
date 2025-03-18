
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Building, MapPin, Phone, Clock, Edit, Save, PlusCircle, Trash, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Business {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  category: string;
  hours: string;
  image: string;
}

const RegisteredBusiness = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<string>('1');
  const [businesses, setBusinesses] = useState<Business[]>([
    {
      id: '1',
      name: 'Coffee Pi',
      address: '123 Main St, San Francisco, CA',
      phone: '+1 (555) 123-4567',
      description: 'Specialty coffee shop accepting Pi cryptocurrency payments for all beverages and pastries.',
      category: 'Food & Beverage',
      hours: 'Mon-Fri: 7am-7pm, Sat-Sun: 8am-6pm',
      image: '/placeholder.svg',
    },
    {
      id: '2',
      name: 'Tech Pi',
      address: '456 Market St, San Francisco, CA',
      phone: '+1 (555) 987-6543',
      description: 'Electronics repair shop with Pi payment options for all services.',
      category: 'Retail',
      hours: 'Mon-Sat: 10am-8pm, Sun: Closed',
      image: '/placeholder.svg',
    },
    {
      id: '3',
      name: 'Pi Clothing',
      address: '789 Mission St, San Francisco, CA',
      phone: '+1 (555) 456-7890',
      description: 'Trendy clothing store with exclusive designs for Pi enthusiasts.',
      category: 'Fashion',
      hours: 'Mon-Sun: 9am-9pm',
      image: '/placeholder.svg',
    },
  ]);
  
  const [editMode, setEditMode] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);
  
  const handleBusinessSelect = (businessId: string) => {
    setSelectedBusiness(businessId);
    setEditMode(false);
  };
  
  const handleEdit = () => {
    const business = businesses.find(b => b.id === selectedBusiness) || null;
    setCurrentBusiness(business);
    setEditMode(true);
  };
  
  const handleSave = () => {
    if (currentBusiness) {
      setBusinesses(businesses.map(b => b.id === currentBusiness.id ? currentBusiness : b));
      setEditMode(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Business) => {
    if (currentBusiness) {
      setCurrentBusiness({
        ...currentBusiness,
        [field]: e.target.value
      });
    }
  };
  
  const selectedBusinessData = businesses.find(b => b.id === selectedBusiness);

  return (
    <AppLayout title="My Registered Businesses">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Registered Businesses</h1>
            <p className="text-muted-foreground">Manage your Pi-accepting businesses</p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Register New Business
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Register New Business</DialogTitle>
                <DialogDescription>
                  Add a new business that accepts Pi cryptocurrency payments.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p>To register a new business, please use the complete Registration form.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" type="button">Cancel</Button>
                <Button asChild>
                  <Link to="/registration">Go to Registration</Link>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <Select value={selectedBusiness} onValueChange={handleBusinessSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a business" />
            </SelectTrigger>
            <SelectContent>
              {businesses.map((business) => (
                <SelectItem key={business.id} value={business.id}>
                  {business.name} - {business.category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedBusinessData && (
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{editMode ? 'Edit Business' : selectedBusinessData.name}</CardTitle>
                <CardDescription>{selectedBusinessData.category}</CardDescription>
              </div>
              
              {editMode ? (
                <div className="flex gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleSave}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Business Details</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="col-span-1">
                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={selectedBusinessData.image} 
                            alt={selectedBusinessData.name} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {!editMode && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-start">
                              <MapPin className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                              <p className="text-sm">{selectedBusinessData.address}</p>
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-5 w-5 text-muted-foreground mr-2" />
                              <p className="text-sm">{selectedBusinessData.phone}</p>
                            </div>
                            <div className="flex items-start">
                              <Clock className="h-5 w-5 text-muted-foreground mr-2 mt-0.5" />
                              <p className="text-sm">{selectedBusinessData.hours}</p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        {editMode ? (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                              <FormItem>
                                <FormLabel>Business Name</FormLabel>
                                <FormControl>
                                  <Input 
                                    value={currentBusiness?.name || ''}
                                    onChange={(e) => handleInputChange(e, 'name')}
                                  />
                                </FormControl>
                              </FormItem>
                              
                              <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                  <Input 
                                    value={currentBusiness?.address || ''}
                                    onChange={(e) => handleInputChange(e, 'address')}
                                  />
                                </FormControl>
                              </FormItem>
                              
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input 
                                    value={currentBusiness?.phone || ''}
                                    onChange={(e) => handleInputChange(e, 'phone')}
                                  />
                                </FormControl>
                              </FormItem>
                              
                              <FormItem>
                                <FormLabel>Business Hours</FormLabel>
                                <FormControl>
                                  <Input 
                                    value={currentBusiness?.hours || ''}
                                    onChange={(e) => handleInputChange(e, 'hours')}
                                  />
                                </FormControl>
                              </FormItem>
                              
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Input 
                                    value={currentBusiness?.description || ''}
                                    onChange={(e) => handleInputChange(e, 'description')}
                                  />
                                </FormControl>
                              </FormItem>
                              
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select 
                                  value={currentBusiness?.category} 
                                  onValueChange={(value) => {
                                    if (currentBusiness) {
                                      setCurrentBusiness({
                                        ...currentBusiness,
                                        category: value
                                      });
                                    }
                                  }}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Food & Beverage">Food & Beverage</SelectItem>
                                    <SelectItem value="Retail">Retail</SelectItem>
                                    <SelectItem value="Fashion">Fashion</SelectItem>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Services">Services</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <h3 className="text-lg font-medium">Description</h3>
                            <p>{selectedBusinessData.description}</p>
                            
                            <div className="border-t pt-4 mt-6">
                              <h3 className="text-lg font-medium mb-3">Business Status</h3>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-md border border-green-100">
                                  <h4 className="font-medium text-green-700 mb-1">Verification Status</h4>
                                  <p className="text-green-600">Verified</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                                  <h4 className="font-medium text-blue-700 mb-1">Pi Payments</h4>
                                  <p className="text-blue-600">Enabled</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                  <h4 className="font-medium text-gray-700 mb-1">Visibility</h4>
                                  <p className="text-gray-600">Public</p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-md border border-yellow-100">
                                  <h4 className="font-medium text-yellow-700 mb-1">Listing Status</h4>
                                  <p className="text-yellow-600">Featured</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Business Performance</CardTitle>
                        <CardDescription>Analytics for the past 30 days</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="bg-gray-50 p-4 rounded-md text-center">
                            <p className="text-muted-foreground text-sm">Profile Views</p>
                            <p className="text-3xl font-bold">254</p>
                            <p className="text-green-600 text-xs">↑ 12% from last month</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md text-center">
                            <p className="text-muted-foreground text-sm">Pi Transactions</p>
                            <p className="text-3xl font-bold">47</p>
                            <p className="text-green-600 text-xs">↑ 8% from last month</p>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-md text-center">
                            <p className="text-muted-foreground text-sm">Customer Rating</p>
                            <p className="text-3xl font-bold">4.8</p>
                            <div className="flex justify-center mt-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-400'}`} 
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
};

export default RegisteredBusiness;
