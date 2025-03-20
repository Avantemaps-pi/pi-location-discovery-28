
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, Info, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppPreferencesProps {
  notifications: boolean;
  setNotifications: (enabled: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  onSaveSettings: () => void;
}

const AppPreferences = ({
  notifications,
  setNotifications,
  isDarkMode,
  setIsDarkMode,
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
        </div>
        
        <div className="pt-4">
          <h3 className="font-medium">Business Verification Requirements</h3>
          <p className="text-sm text-muted-foreground mt-1">
            As a Business Owner, you need to complete these steps to get verified:
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
          <ScrollArea className="h-60 w-full pr-4" type="always">
            <div className="pr-20">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-blue-800">Verification Process</h4>
                  </div>
                  <ul className="mt-2 space-y-3 text-sm">
                    <li className="flex items-start">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-0.5 mr-2">1</Badge>
                      <div>
                        <p className="font-medium">Register your business</p>
                        <p className="text-muted-foreground">Complete all required business information</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-0.5 mr-2">2</Badge>
                      <div>
                        <p className="font-medium">Request Verification via Email</p>
                        <p className="text-muted-foreground">After registering your business, request a verification via email, but only if you meet the requirements</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 mt-0.5 mr-2">3</Badge>
                      <div>
                        <p className="font-medium">Get Verified Badge</p>
                        <p className="text-muted-foreground">Once approved, your business will show as verified</p>
                        <div className="mt-2">
                          <Button variant="link" size="sm" asChild className="text-blue-700 p-0">
                            <Link to="/verification-info">
                              <span>View verification and certification details</span>
                              <ExternalLink className="h-3.5 w-3.5 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
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
