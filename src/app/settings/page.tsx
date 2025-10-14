'use client';


import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Switch } from '@/app/components/ui/switch';
import { Separator } from '@/app/components/ui/separator';
import { Label } from '@/app/components/ui/label';
import UserInfo from './UserInfo';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  return (
    <main className="flex-1 h-full w-full p-4 md:p-8">
      <div className="flex flex-col space-y-8 h-full">
        {/* Header */}
        <header className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight font-headline">
            Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your account and application settings.
          </p>
        </header>

        {/* Cards in flex */}
        <div className="flex flex-col lg:flex-row gap-8 flex-1">
          {/* Profile Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <UserInfo />
              
            </CardContent>
            
          </Card>

          {/* Notifications Card */}
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="email-notifications"
                  className="flex flex-col space-y-1"
                >
                  <span>Email Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Receive updates about your account and interactions.
                  </span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="push-notifications"
                  className="flex flex-col space-y-1"
                >
                  <span>Push Notifications</span>
                  <span className="font-normal leading-snug text-muted-foreground">
                    Get real-time alerts on your devices.
                  </span>
                </Label>
                <Switch id="push-notifications" />
              </div>
              
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
