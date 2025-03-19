
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppPreferencesProps {
  searchRadius: string;
  setSearchRadius: (radius: string) => void;
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isWorldwideSearch: boolean;
  setIsWorldwideSearch: (search: boolean) => void;
  onSaveSettings: () => void;
}

const AppPreferences = ({
  searchRadius,
  setSearchRadius,
  notifications,
  setNotifications,
  isDarkMode,
  setIsDarkMode,
  isWorldwideSearch,
  setIsWorldwideSearch,
  onSaveSettings
}: AppPreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Preferences</CardTitle>
        <CardDescription>Customize your Avante Maps experience.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Push Notifications</Label>
              <p className="text-muted-foreground text-sm">Receive notifications about new Pi-accepting businesses.</p>
            </div>
            <Switch 
              id="notifications" 
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-muted-foreground text-sm">Toggle between light and dark themes.</p>
            </div>
            <Switch 
              id="dark-mode" 
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="space-y-0.5">
              <Label htmlFor="worldwide-search">Worldwide Search</Label>
              <p className="text-muted-foreground text-sm">Search for Pi-accepting businesses worldwide.</p>
            </div>
            <Switch 
              id="worldwide-search" 
              checked={isWorldwideSearch}
              onCheckedChange={setIsWorldwideSearch}
            />
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Search Radius</Label>
          <RadioGroup defaultValue={searchRadius} onValueChange={setSearchRadius} className="flex flex-col space-y-1">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="5km" id="r1" />
              <Label htmlFor="r1" className="font-normal">5 kilometers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="10km" id="r2" />
              <Label htmlFor="r2" className="font-normal">10 kilometers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="20km" id="r3" />
              <Label htmlFor="r3" className="font-normal">20 kilometers</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="50km" id="r4" />
              <Label htmlFor="r4" className="font-normal">50 kilometers</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="pt-4">
          <h3 className="font-medium">Business Verification Requirements</h3>
          <p className="text-sm text-muted-foreground mt-1">
            As a Business Owner, you need to complete these steps to get verified:
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <ScrollArea className="h-48 pr-4">
            <div className="flex items-start">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="w-full">
                <h4 className="font-medium text-blue-800">Verification Process</h4>
                <ul className="mt-2 space-y-3 text-sm">
                  <li className="flex items-start">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-0.5 mr-2">1</Badge>
                    <div>
                      <p className="font-medium">Register your business</p>
                      <p className="text-muted-foreground">Complete all required business information</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 mt-0.5 mr-2">2</Badge>
                    <div>
                      <p className="font-medium">Provide Business Documents</p>
                      <p className="text-muted-foreground">Upload business license, registration certificate, or tax ID</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 mt-0.5 mr-2">3</Badge>
                    <div>
                      <p className="font-medium">Proof of Pi Acceptance</p>
                      <p className="text-muted-foreground">Confirm that your business accepts Pi cryptocurrency</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 mt-0.5 mr-2">4</Badge>
                    <div>
                      <p className="font-medium">Verification Review</p>
                      <p className="text-muted-foreground">Our team will review your documents (takes 2-3 business days)</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-0.5 mr-2">5</Badge>
                    <div>
                      <p className="font-medium">Get Verified Badge</p>
                      <p className="text-muted-foreground">Once approved, your business will show as verified</p>
                    </div>
                  </li>
                </ul>
                <Button variant="link" size="sm" asChild className="mt-3 h-auto p-0 text-blue-700">
                  <Link to="/verification-info">
                    <Info className="h-3.5 w-3.5 mr-1" />
                    <span>Learn more about verification</span>
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSaveSettings}>Save Preferences</Button>
      </CardFooter>
    </Card>
  );
};

export default AppPreferences;
