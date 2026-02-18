/**
 * Admin Dashboard - Devias Kit Style
 * Overview with stats cards and recent activity
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FolderKanban, TrendingUp, Users, ArrowRight, Plus } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalCollections: number;
  totalOrders: number;
  totalCustomers: number;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalCollections: 0,
    totalOrders: 0,
    totalCustomers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        // Fetch products and collections counts
        const [productsRes, collectionsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/collections'),
        ]);

        const productsData = await productsRes.json();
        const collectionsData = await collectionsRes.json();

        setStats({
          totalProducts: productsData.meta?.total || productsData.products?.length || 0,
          totalCollections: Array.isArray(collectionsData) ? collectionsData.length : (collectionsData.collections?.length || 0),
          totalOrders: 0, // Placeholder
          totalCustomers: 0, // Placeholder
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: Package,
      color: 'blue',
      href: '#admin/products',
    },
    {
      title: 'Collections',
      value: stats.totalCollections,
      icon: FolderKanban,
      color: 'purple',
      href: '#admin/collections',
    },
    {
      title: 'Orders',
      value: stats.totalOrders,
      icon: TrendingUp,
      color: 'green',
      href: '#admin/orders',
    },
    {
      title: 'Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'orange',
      href: '#admin/customers',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
  };

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {loading ? '...' : stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <a
                  href={stat.href}
                  className="mt-4 flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks to manage your store</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/admin/products/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/collections/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Add Collection
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              View Storefront
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Latest products added to your store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500 text-sm">
                No recent products
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Health check and system information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">API Server</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                  Available
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
