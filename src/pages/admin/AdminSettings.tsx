import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export function AdminSettings() {
  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Configure your store settings</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>Store settings will be available in a future update.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Settings className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Settings coming soon</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              Store configuration options will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </AdminShell>
  );
}
