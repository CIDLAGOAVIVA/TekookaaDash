import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboardPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, Admin!</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is your administrative dashboard. From here, you can manage system settings, users, and other administrative tasks.</p>
          <p className="mt-4">Use the navigation on the left to get started.</p>
        </CardContent>
      </Card>
    </div>
  );
}
