
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Shield, ExternalLink, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AppPreferencesProps {
  searchRadius: string;
  setSearchRadius: (value: string) => void;
  notifications: boolean;
  setNotifications: (value: boolean) => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isWorldwideSearch: boolean;
  setIsWorldwideSearch: (value: boolean) => void;
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
  onSaveSettings,
}: AppPreferencesProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>App Preferences</CardTitle>
        <CardDescription>Customize how the application works for you.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="notifications">Push Notifications</Label>
            <p className="text-xs text-muted-foreground">Receive alerts about new businesses and events</p>
          </div>
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="darkMode">Dark Mode</Label>
            <p className="text-xs text-muted-foreground">Use dark theme for the application</p>
          </div>
          <Switch
            id="darkMode"
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="searchRadius">Default Search Radius</Label>
          <div className="flex space-x-2 items-center">
            <Select value={searchRadius} onValueChange={setSearchRadius} disabled={isWorldwideSearch}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1km">1 km</SelectItem>
                <SelectItem value="5km">5 km</SelectItem>
                <SelectItem value="10km">10 km</SelectItem>
                <SelectItem value="20km">20 km</SelectItem>
                <SelectItem value="50km">50 km</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="worldwideSearch"
                checked={isWorldwideSearch}
                onCheckedChange={setIsWorldwideSearch}
              />
              <div className="space-y-0.5">
                <Label htmlFor="worldwideSearch" className="flex items-center">
                  <Globe className="h-4 w-4 mr-1" /> Worldwide
                </Label>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Default distance to search for businesses, or select worldwide to see all businesses.
          </p>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md max-h-48">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="w-full">
              <h3 className="font-medium text-blue-900">Business Verification</h3>
              <ScrollArea className="h-36 pr-4">
                <div className="pr-4">
                  <p className="text-sm text-blue-700 mt-1 mb-3 break-words">
                    Learn about our verification and certification processes to increase the credibility of your Pi business.
                  </p>
                  <Button asChild variant="outline" className="bg-white border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800">
                    <Link to="/verification-info" className="flex items-center">
                      View Verification Requirements <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onSaveSettings}>Save Settings</Button>
      </CardFooter>
    </Card>
  );
};

export default AppPreferences;
