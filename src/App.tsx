import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { ScrollToTop } from '@/components/ScrollToTop';
import { Home } from '@/pages/Home';
import { Collection } from '@/pages/Collection';
import { ProductDetail } from '@/pages/ProductDetail';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Loyalty } from '@/pages/Loyalty';
import { Account } from '@/pages/Account';
import { AdminLogin } from '@/pages/admin/AdminLogin';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminProducts } from '@/pages/admin/AdminProducts';
import { AdminCollections } from '@/pages/admin/AdminCollections';
import { AdminCustomers } from '@/pages/admin/AdminCustomers';
import { AdminSettings } from '@/pages/admin/AdminSettings';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

// Layout wrapper for public pages
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

// Layout wrapper for admin pages
function AdminLayout({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>;
}

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/loyalty" element={<PublicLayout><Loyalty /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
        <Route path="/collection" element={<PublicLayout><Collection /></PublicLayout>} />
        <Route path="/collection/:slug" element={<PublicLayout><Collection /></PublicLayout>} />
        <Route path="/product/:slug" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/account" element={<PublicLayout><Account /></PublicLayout>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLayout><AdminLogin /></AdminLayout>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout><AdminDashboard /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute>
              <AdminLayout><AdminProducts /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/collections"
          element={
            <ProtectedRoute>
              <AdminLayout><AdminCollections /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute>
              <AdminLayout><AdminCustomers /></AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminLayout><AdminSettings /></AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
