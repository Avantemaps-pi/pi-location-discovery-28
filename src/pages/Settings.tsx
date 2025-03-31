
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { toast } from 'sonner';
import ProfileSettings from '@/components/settings/ProfileSettings';
import AppPreferences from '@/components/settings/AppPreferences';
import DangerZone from '@/components/settings/DangerZone';
import { useIsMobile } from '@/hooks/use-mobile';

const Settings = () => {
  const isMobile = useIsMobile();
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'english';
  });
  
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem('notifications') === 'false' ? false : true;
  });
  
  const [colorScheme, setColorScheme] = useState<'system' | 'light' | 'dark'>(() => {
    return (localStorage.getItem('colorScheme') as 'system' | 'light' | 'dark') || 'system';
  });
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedScheme = localStorage.getItem('colorScheme');
    if (savedScheme === 'dark') return true;
    if (savedScheme === 'light') return false;
    
    // If 'system', default to light instead of checking system preference
    return false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // For system mode, we'll still listen for system changes, but default to light
  useEffect(() => {
    if (colorScheme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDarkMode(e.matches);
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [colorScheme]);

  const handleColorSchemeChange = (scheme: 'system' | 'light' | 'dark') => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    
    if (scheme === 'dark') {
      setIsDarkMode(true);
    } else if (scheme === 'light') {
      setIsDarkMode(false);
    } else {
      // System preference - default to light
      setIsDarkMode(false);
    }
  };

  const handleSaveSettings = () => {
    localStorage.setItem('language', language);
    localStorage.setItem('notifications', String(notifications));
    
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
    <AppLayout title="" fullWidth={false} className="overflow-x-hidden">
      <div className="w-full max-w-lg mx-auto px-3 sm:px-4 py-4 sm:py-6 overflow-hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">Manage your account preferences.</p>
        </div>

        <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-6 overflow-hidden">
          <ProfileSettings 
            language={language} 
            setLanguage={setLanguage} 
            isMobile={isMobile}
          />

          <AppPreferences 
            notifications={notifications}
            setNotifications={setNotifications}
            isDarkMode={isDarkMode}
            colorScheme={colorScheme}
            onColorSchemeChange={handleColorSchemeChange}
            onSaveSettings={handleSaveSettings}
          />

          <DangerZone 
            onDeleteAccount={handleDeleteAccount}
            onReinstateAccount={handleReinstateAccount}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
