import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, Menu, X, Heart } from 'lucide-react';
import { collections } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { TopBar } from './TopBar';
import { SearchBar } from './SearchBar';
import { MegaMenu } from './MegaMenu';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();
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
      href: '#collection',
    },
    {
      id: 'about',
      label: 'Hakkımızda',
      href: '#about',
    },
    {
      id: 'contact',
      label: 'İletişim',
      href: '#contact',
    },
    {
      id: 'loyalty',
      label: 'Loyalty Points',
      href: '#loyalty',
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
            <a href="#home" className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-xl lg:text-2xl font-semibold text-[var(--brand-black)]">
                Fitnlitt
              </span>
            </a>

            {/* Desktop Search Bar */}
            <div className="hidden lg:block flex-1">
              <SearchBar />
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
              <a href="#cart" className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--primary-coral)] text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </a>
              
              {/* Account */}
              <button className="hidden sm:block p-2 hover:bg-black/5 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </button>

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
        <div className="hidden lg:block border-t border-black/5">
          <div className="container-custom">
            <div className="flex items-center justify-center gap-8 h-12 relative">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => item.items && handleMouseEnter(item.id)}
                  onMouseLeave={() => item.items && handleMouseLeave()}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-[var(--brand-black)] hover:text-[var(--primary-coral)] transition-colors py-3 inline-block"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      className="text-sm font-medium text-[var(--brand-black)] hover:text-[var(--primary-coral)] transition-colors py-3"
                    >
                      {item.label}
                    </button>
                  )}

                  {/* Mega Menu Trigger */}
                  {item.items && activeDropdown === item.id && (
                    <MegaMenu 
                      collections={item.items} 
                      onClose={() => setActiveDropdown(null)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden glass-effect border-t border-black/5">
            <div className="container-custom py-4 space-y-4">
              {navigationItems.map((item) => (
                <div key={item.id}>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="block py-2 text-base font-medium text-[var(--brand-black)]"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
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
                            <a
                              key={subItem.id}
                              href="#collection"
                              className="block py-1 text-sm text-muted-foreground hover:text-[var(--primary-coral)]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {subItem.name}
                            </a>
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
    </header>
  );
};
