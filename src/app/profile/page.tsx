'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/contexts/AppContext';
import { Navbar } from '@/components/navigation/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Edit2, 
  Save, 
  X,
  Camera,
  Shield,
  Award,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { updateProfile } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export default function ProfilePage() {
  const { state, dispatch, addNotification } = useApp();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!state.isLoading && !state.isAuthenticated) {
      router.push('/');
    }
  }, [state.isAuthenticated, state.isLoading, router]);

  useEffect(() => {
    if (state.user) {
      setDisplayName(state.user.displayName || '');
      // You can extend this to load additional user data from Firestore
    }
  }, [state.user]);

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

  const handleSave = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
        dispatch({ type: 'SET_USER', payload: auth.currentUser });
        addNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated.',
        });
        setIsEditing(false);
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update profile. Please try again.',
      });
    }
  };

  const handleCancel = () => {
    setDisplayName(state.user?.displayName || '');
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    {
      label: 'Total Predictions',
      value: '156',
      icon: BarChart3,
      color: 'text-blue-500',
    },
    {
      label: 'Crops Analyzed',
      value: '23',
      icon: Award,
      color: 'text-green-500',
    },
    {
      label: 'Account Status',
      value: 'Active',
      icon: Shield,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account information and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit2 className="h-4 w-4" />
                      Edit
                    </Button>
                  )}
                </div>
                <CardDescription>
                  Update your personal details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={state.user?.photoURL || undefined} alt={state.user?.displayName || 'User'} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                        {state.user?.displayName ? getInitials(state.user.displayName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {state.user?.displayName || 'User'}
                    </h3>
                    <p className="text-muted-foreground">{state.user?.email}</p>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    {isEditing ? (
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-foreground">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{state.user?.displayName || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{state.user?.email || 'Not available'}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+91 1234567890"
                        type="tel"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-foreground">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{phoneNumber || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City, State"
                      />
                    ) : (
                      <div className="flex items-center gap-2 text-foreground">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{location || 'Not set'}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {state.user?.metadata.creationTime
                          ? new Date(state.user.metadata.creationTime).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })
                          : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <Button onClick={handleSave} className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Account Stats */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle>Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Icon className={`h-5 w-5 ${stat.color}`} />
                        <span className="text-sm text-muted-foreground">{stat.label}</span>
                      </div>
                      <span className="font-semibold text-foreground">{stat.value}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/settings')}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/home')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

