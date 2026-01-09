'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon,
  Sun,
  Monitor,
  Eye,
  Save
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const { state, dispatch, addNotification } = useApp();
  const router = useRouter();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  // Show loading state
  if (state.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!state.isAuthenticated) {
    return null; // Will redirect
  }

  const handleSaveSettings = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('emailNotifications', String(emailNotifications));
    localStorage.setItem('pushNotifications', String(pushNotifications));
    localStorage.setItem('marketingEmails', String(marketingEmails));

    addNotification({
      type: 'success',
      title: 'Settings Saved',
      message: 'Your preferences have been saved successfully.',
    });
  };

  const toggleTheme = (theme: 'light' | 'dark' | 'system') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    addNotification({
      type: 'success',
      title: 'Theme Updated',
      message: `Theme changed to ${theme} mode.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </motion.div>

        <div className="space-y-6">
          {/* Appearance Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Appearance</CardTitle>
                </div>
                <CardDescription>Customize the look and feel of the application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      variant={state.theme === 'light' ? 'default' : 'outline'}
                      onClick={() => toggleTheme('light')}
                      className="flex items-center gap-2"
                    >
                      <Sun className="h-4 w-4" />
                      Light
                    </Button>
                    <Button
                      variant={state.theme === 'dark' ? 'default' : 'outline'}
                      onClick={() => toggleTheme('dark')}
                      className="flex items-center gap-2"
                    >
                      <Moon className="h-4 w-4" />
                      Dark
                    </Button>
                    <Button
                      variant={state.theme === 'system' ? 'default' : 'outline'}
                      onClick={() => toggleTheme('system')}
                      className="flex items-center gap-2"
                    >
                      <Monitor className="h-4 w-4" />
                      System
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  <CardTitle>Notifications</CardTitle>
                </div>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email updates about your crop predictions
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get real-time alerts and updates
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about new features and tips
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Privacy & Security</CardTitle>
                </div>
                <CardDescription>Manage your account security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Password</Label>
                  <Button variant="outline" className="w-full justify-start">
                    <Eye className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex justify-end gap-3"
          >
            <Button variant="outline" onClick={() => router.push('/home')}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Settings
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

