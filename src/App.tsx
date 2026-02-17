import React, { useState } from 'react';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Home } from '@/pages/Home';
import { Collection } from '@/pages/Collection';
import { ProductDetail } from '@/pages/ProductDetail';
import { Cart } from '@/pages/Cart';
import { Checkout } from '@/pages/Checkout';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Loyalty } from '@/pages/Loyalty';

type Page = 'home' | 'collection' | 'product' | 'cart' | 'checkout' | 'about' | 'contact' | 'loyalty';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Simple client-side routing simulation
  React.useEffect(() => {
    const handleNavigation = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentPage(hash as Page);
    };

    window.addEventListener('hashchange', handleNavigation);
    handleNavigation();

    return () => window.removeEventListener('hashchange', handleNavigation);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'collection':
        return <Collection />;
      case 'product':
        return <ProductDetail />;
      case 'cart':
        return <Cart />;
      case 'checkout':
        return <Checkout />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'loyalty':
        return <Loyalty />;
      default:
        return <Home />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;
