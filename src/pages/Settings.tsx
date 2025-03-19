
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPinned, Bell, ShieldAlert, User, Lock, Globe, AlertTriangle } from 'lucide-react';

const Settings = () => {
  const [locationPermission, setLocationPermission] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [searchRadius, setSearchRadius] = useState('10');
  const [language, setLanguage] = useState('en');

  const handleSavePreferences = () => {
    toast.success('Settings saved successfully!');
  };

  const handleSaveAccountInfo = () => {
    toast.success('Account information updated successfully!');
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account and preferences.</p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPinned className="h-5 w-5 mr-2 text-avante-blue" />
                  Map Preferences
                </CardTitle>
                <CardDescription>Customize how you view and interact with the map.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="distance-unit">Distance Unit</Label>
                      <p className="text-sm text-muted-foreground">Choose your preferred unit of measurement.</p>
                    </div>
                    <Select value={distanceUnit} onValueChange={setDistanceUnit}>
                      <SelectTrigger id="distance-unit" className="w-40">
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="miles">Miles</SelectItem>
                        <SelectItem value="kilometers">Kilometers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="search-radius">Default Search Radius</Label>
                      <p className="text-sm text-muted-foreground">Set the default radius when searching for businesses.</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input 
                        id="search-radius" 
                        type="number" 
                        className="w-20" 
                        value={searchRadius} 
                        onChange={(e) => setSearchRadius(e.target.value)}
                      />
                      <span className="text-sm">{distanceUnit}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Use a darker theme for the application.</p>
                    </div>
                    <Switch 
                      id="dark-mode" 
                      checked={darkModeEnabled} 
                      onCheckedChange={setDarkModeEnabled}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-avante-purple" />
                  Language Preferences
                </CardTitle>
                <CardDescription>Set your preferred language for the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="language">Display Language</Label>
                    <p className="text-sm text-muted-foreground">Choose your preferred language for translation.</p>
                  </div>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" className="w-40">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePreferences} className="bg-avante-blue hover:bg-avante-blue/90">
                  Save Language Preference
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-avante-purple" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Manage your notification preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notification-toggle">Enable Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications about new businesses and updates.</p>
                    </div>
                    <Switch 
                      id="notification-toggle" 
                      checked={notificationsEnabled} 
                      onCheckedChange={setNotificationsEnabled} 
                    />
                  </div>

                  {notificationsEnabled && (
                    <>
                      <Separator />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="new-businesses">New Pi-accepting businesses nearby</Label>
                          <Switch id="new-businesses" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="special-offers">Special offers and promotions</Label>
                          <Switch id="special-offers" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="app-updates">App updates and announcements</Label>
                          <Switch id="app-updates" defaultChecked />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSavePreferences} className="bg-avante-blue hover:bg-avante-blue/90">
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-avante-blue" />
                  Account Information
                </CardTitle>
                <CardDescription>Update your personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="Enter your first name" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Enter your last name" defaultValue="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="Enter your email" defaultValue="john.doe@example.com" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" placeholder="Enter your phone number" defaultValue="+1 (555) 123-4567" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAccountInfo} className="bg-avante-blue hover:bg-avante-blue/90">
                  Update Account
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-avante-purple" />
                  Password
                </CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="Enter your current password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="Enter your new password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm your new password" />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Password updated successfully!')} className="bg-avante-blue hover:bg-avante-blue/90">
                  Change Password
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-avante-teal" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Manage your privacy and location settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="location-permission">Location Permission</Label>
                      <p className="text-sm text-muted-foreground">Allow Avante Maps to access your location.</p>
                    </div>
                    <Switch 
                      id="location-permission" 
                      checked={locationPermission} 
                      onCheckedChange={setLocationPermission} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-collection">Data Collection</Label>
                      <p className="text-sm text-muted-foreground">Allow anonymous usage data collection to improve the app.</p>
                    </div>
                    <Switch id="data-collection" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing">Marketing Communications</Label>
                      <p className="text-sm text-muted-foreground">Receive marketing emails and communications.</p>
                    </div>
                    <Switch id="marketing" defaultChecked={false} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => toast.success('Privacy settings updated!')} className="bg-avante-blue hover:bg-avante-blue/90">
                  Save Privacy Settings
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600">Delete Account</CardTitle>
                <CardDescription>Permanently remove your account and all associated data.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-amber-500">Warning:</span> Your account will be immediately inactive and all your information will be permanently deleted after 15 days.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start space-y-4">
                <Button 
                  variant="destructive" 
                  onClick={() => toast.error('Feature disabled in demo')}
                  className="w-full sm:w-auto"
                >
                  Delete Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => toast.success('Account reinstated!')}
                  className="w-full sm:w-auto"
                >
                  Reinstate Account
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
