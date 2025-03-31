
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProfileSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
  isMobile?: boolean;
}

const ProfileSettings = ({ language, setLanguage, isMobile }: ProfileSettingsProps) => {
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
          <Input id="username" placeholder="johnsmith" value="johnsmith" readOnly className="bg-gray-100 h-9" />
          <p className="text-xs text-muted-foreground mt-1">
            Username cannot be changed.
          </p>
        </div>
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="email" className="text-sm">Email</Label>
          <Input id="email" type="email" placeholder="john.smith@example.com" value="john.smith@example.com" readOnly className="bg-gray-100 h-9" />
          <p className="text-xs text-muted-foreground mt-1">
            Email address cannot be changed.
          </p>
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
