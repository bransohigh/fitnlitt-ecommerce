/**
 * Admin Sidebar Navigation - Devias Kit Style
 * Left sidebar with logo, menu items, and user info
 */

import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    id: 'products',
    label: 'Products',
    icon: Package,
    href: '/admin/products',
  },
  {
    id: 'collections',
    label: 'Collections',
    icon: FolderKanban,
    href: '/admin/collections',
  },
  {
    id: 'orders',
    label: 'Siparişler',
    icon: ShoppingBag,
    href: '/admin/orders',
  },
  {
    id: 'customers',
    label: 'Müşteriler',
    icon: Users,
    href: '/admin/customers',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
];

export function AdminSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const activeItem = navItems.find(item => item.href === location.pathname)?.id || 'dashboard';

  const handleLogout = async () => {
    if (confirm('Are you sure you want to sign out?')) {
      await signOut();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-200">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">F</span>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Fitnlitt</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <Link
              key={item.id}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                  {item.badge}
                </span>
              )}
              {isActive && (
                <ChevronRight className="w-4 h-4 text-blue-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.email?.charAt(0).toUpperCase() || 'A'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email || 'Admin User'}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
