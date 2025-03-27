
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
}

const ProfileSettings = ({ language, setLanguage }: ProfileSettingsProps) => {
  // Apply language change effect (in a real app, this would change the UI language)
  useEffect(() => {
    console.log(`Language changed to: ${language}`);
    // In a real app, this would involve i18n library integration
  }, [language]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Manage your personal information and preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input id="username" placeholder="johnsmith" value="johnsmith" readOnly className="bg-gray-100" />
          <p className="text-xs text-muted-foreground mt-1">
            Username cannot be changed.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="john.smith@example.com" value="john.smith@example.com" readOnly className="bg-gray-100" />
          <p className="text-xs text-muted-foreground mt-1">
            Email address cannot be changed.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="language">Language Preference</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
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
