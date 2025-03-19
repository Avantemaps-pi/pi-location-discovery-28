import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Globe, Shield, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';

const Settings = () => {
  const [language, setLanguage] = useState('english');
  const [searchRadius, setSearchRadius] = useState('10km');
  const [notifications, setNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isWorldwideSearch, setIsWorldwideSearch] = useState(true);

  const handleSaveSettings = () => {
    toast.success('Settings saved successfully!');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion is not available in the demo', {
      description: 'In a real application, this would initiate the account deletion process.',
    });
  };

  const handleReinstateAccount = () => {
    toast.success('Account has been reinstated', {
      description: 'Your account has been successfully reactivated.',
    });
  };

  return (
    <AppLayout title="Settings">
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account preferences.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your personal information and preferences.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" placeholder="johnsmith" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="john.smith@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language Preference</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Español</SelectItem>
                  <SelectItem value="french">Français</SelectItem>
                  <SelectItem value="german">Deutsch</SelectItem>
                  <SelectItem value="chinese">中文</SelectItem>
                  <SelectItem value="japanese">日本語</SelectItem>
                  <SelectItem value="korean">한국어</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                This will translate the app interface into your preferred language.
              </p>
            </div>
          </CardContent>
        </Card>

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

            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md">
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
            <Button onClick={handleSaveSettings}>Save Settings</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Actions here cannot be easily reversed. Please proceed with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button variant="destructive" onClick={handleDeleteAccount} className="w-full">
                Delete Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Warning: Your account will be immediately inactive and all your information will 
                be permanently deleted after 15 days.
              </p>
            </div>
            <Separator />
            <div>
              <Button variant="outline" onClick={handleReinstateAccount} className="w-full">
                Reinstate Account
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                If your account is scheduled for deletion, you can reinstate it.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Settings;
