
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';
import ProfileSettings from '@/components/settings/ProfileSettings';
import AppPreferences from '@/components/settings/AppPreferences';
import DangerZone from '@/components/settings/DangerZone';

const Settings = () => {
  const [language, setLanguage] = useState('english');
  const [notifications, setNotifications] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

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

        <ProfileSettings 
          language={language} 
          setLanguage={setLanguage} 
        />

        <AppPreferences 
          notifications={notifications}
          setNotifications={setNotifications}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          onSaveSettings={handleSaveSettings}
        />

        <DangerZone 
          onDeleteAccount={handleDeleteAccount}
          onReinstateAccount={handleReinstateAccount}
        />
      </div>
    </AppLayout>
  );
};

export default Settings;
