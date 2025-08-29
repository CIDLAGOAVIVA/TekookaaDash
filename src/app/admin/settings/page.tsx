'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = () => {
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Manage general system settings and features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="maintenance-mode" className="flex flex-col space-y-1">
              <span>Maintenance Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Temporarily disable access to the main dashboard for users.
              </span>
            </Label>
            <Switch id="maintenance-mode" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <Input id="api-key" type="password" defaultValue="****************" />
            <p className="text-sm text-muted-foreground">Enter your primary API key for external service integrations.</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="admin-email">Administrator Email</Label>
            <Input id="admin-email" type="email" defaultValue="admin@agrodash.com" />
            <p className="text-sm text-muted-foreground">The email address for receiving system notifications.</p>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
