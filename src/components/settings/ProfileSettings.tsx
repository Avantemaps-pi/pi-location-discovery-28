
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PiUser } from '@/context/AuthContext';

interface ProfileSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
  isMobile?: boolean;
  user: PiUser | null;
  isLoading: boolean;
}

const ProfileSettings = ({ 
  language, 
  setLanguage, 
  isMobile,
  user,
  isLoading 
}: ProfileSettingsProps) => {
  // Apply language change effect (in a real app, this would change the UI language)
  useEffect(() => {
    console.log(`Language changed to: ${language}`);
    // In a real app, this would involve i18n library integration
  }, [language]);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Profile Settings</CardTitle>
        <CardDescription className="text-xs sm:text-sm">Manage your personal information and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0 space-y-4 sm:space-y-6">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="username" className="text-sm">Username</Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input 
              id="username" 
              placeholder="username" 
              value={user?.username || ''} 
              readOnly 
              className="bg-gray-100 h-9" 
            />
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Username is provided by Pi Network and cannot be changed.
          </p>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="email" className="text-sm">Email</Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input 
              id="email" 
              type="email" 
              placeholder="Not provided" 
              value={user?.email || ''} 
              readOnly 
              className="bg-gray-100 h-9" 
            />
          )}
          <p className="text-xs text-muted-foreground mt-1">
            Email address is provided by Pi Network and cannot be changed.
          </p>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="subscription" className="text-sm">Subscription Tier</Label>
          {isLoading ? (
            <Skeleton className="h-9 w-full" />
          ) : (
            <Input 
              id="subscription" 
              placeholder="Individual" 
              value={user?.subscriptionTier?.charAt(0).toUpperCase() + user?.subscriptionTier?.slice(1).replace('-', ' ') || 'Individual'} 
              readOnly 
              className="bg-gray-100 h-9" 
            />
          )}
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="language" className="text-sm">Language Preference</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            This will translate the app interface into your preferred language.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;
