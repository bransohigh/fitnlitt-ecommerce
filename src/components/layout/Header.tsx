import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAppData } from '@/context/AppDataContext';
import { TopBar } from './TopBar';
import { SearchBox } from './SearchBox';
import { MegaMenu } from './MegaMenu';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const { totalItems } = useCart();
  const { collections } = useAppData();
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (itemId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(itemId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200); // 200ms delay before closing
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  const navigationItems = [
    {
      id: 'collections',
      label: 'Koleksiyonlar',
      items: collections.slice(0, 6),
    },
    {
      id: 'new',
      label: 'Yeni Ürünler',
      href: '/collection?sort=newest',
    },
    {
      id: 'about',
      label: 'Hakkımızda',
      href: '/about',
    },
    {
      id: 'contact',
      label: 'İletişim',
      href: '/contact',
    },
    {
      id: 'loyalty',
      label: 'Loyalty Points',
      href: '/loyalty',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Top Utility Bar */}
      <TopBar />

      {/* Main Header */}
      <nav className="glass-effect border-b border-black/5">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xl lg:text-2xl font-semibold text-[var(--brand-black)]">
                Fitnlitt
              </span>
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-1 px-6">
              <SearchBox />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 lg:gap-2">
              {/* Mobile Search */}
              <button className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <button 
                className="hidden sm:block p-2 hover:bg-black/5 rounded-full transition-colors relative"
                aria-label="Favoriler"
              >
                <Heart className="w-5 h-5" />
              </button>
              
              {/* Cart */}
              <button 
                onClick={() => setCartDrawerOpen(true)}
                className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Sepet"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--primary-coral)] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              
              {/* Account */}
              <Link to="/account" className="hidden sm:block p-2 hover:bg-black/5 rounded-full transition-colors" aria-label="Hesabım">
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation + Mega Menu */}
        <div
          className="hidden lg:block border-t border-black/5 relative"
          onMouseLeave={handleMouseLeave}
        >
          <div className="container-custom">
            <div className="flex items-center justify-center gap-8 h-12">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  onMouseEnter={() => item.items ? handleMouseEnter(item.id) : undefined}
                >
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="text-sm font-medium text-[var(--brand-black)] hover:text-[var(--primary-coral)] transition-colors py-3 inline-block"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      className={`text-sm font-medium transition-colors py-3 ${activeDropdown === item.id ? 'text-[var(--primary-coral)]' : 'text-[var(--brand-black)] hover:text-[var(--primary-coral)]'}`}
                    >
                      {item.label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mega Menu — absolute within this full-width nav block */}
          {navigationItems.map((item) =>
            item.items && activeDropdown === item.id ? (
              <div
                key={item.id}
                className="absolute top-12 left-0 right-0 z-50"
                onMouseEnter={() => handleMouseEnter(item.id)}
              >
                <MegaMenu
                  collections={item.items}
                  onClose={() => setActiveDropdown(null)}
                />
              </div>
            ) : null
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-effect border-t border-black/5">
            <div className="container-custom py-4 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  {item.href ? (
                    <Link
                      to={item.href}
                      className="block py-2 text-base font-medium text-[var(--brand-black)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <>
                      <button
                        className="w-full text-left py-2 text-base font-medium text-[var(--brand-black)]"
                        onClick={() =>
                          setActiveDropdown(activeDropdown === item.id ? null : item.id)
                        }
                      >
                        {item.label}
                      </button>
                      {activeDropdown === item.id && item.items && (
                        <div className="pl-4 space-y-2 mt-2">
                          {item.items.map((subItem) => (
                            <Link
                              key={subItem.id}
                              to={`/collection/${subItem.slug}`}
                              className="block py-1 text-sm text-muted-foreground hover:text-[var(--primary-coral)]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Mini Cart Drawer */}
      <MiniCartDrawer isOpen={cartDrawerOpen} onClose={() => setCartDrawerOpen(false)} />
    </header>
  );
};
