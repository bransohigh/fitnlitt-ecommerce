import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { collections } from '@/data/products';
import { useCart } from '@/context/CartContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { totalItems } = useCart();

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
      <nav className="glass-effect border-b border-black/5">
        <div className="container-custom">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#home" className="flex items-center space-x-2">
              <span className="text-2xl font-semibold text-[var(--brand-black)]">
                Fitnlitt
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => item.items && setActiveDropdown(item.id)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-[var(--brand-black)] hover:text-[var(--primary-coral)] transition-colors"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <button
                      className="text-sm font-medium text-[var(--brand-black)] hover:text-[var(--primary-coral)] transition-colors"
                    >
                      {item.label}
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {item.items && activeDropdown === item.id && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[600px] glass-effect rounded-xl border border-black/5 shadow-xl p-6">
                      <div className="grid grid-cols-3 gap-4">
                        {item.items.map((subItem) => (
                          <a
                            key={subItem.id}
                            href="#collection"
                            className="group block"
                          >
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-2">
                              <img
                                src={subItem.image}
                                alt={subItem.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <h4 className="text-sm font-medium text-[var(--brand-black)] group-hover:text-[var(--primary-coral)]">
                              {subItem.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {subItem.description}
                            </p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <Search className="w-5 h-5" />
              </button>
              
              <a href="#cart" className="relative p-2 hover:bg-black/5 rounded-full transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[var(--primary-coral)] text-[var(--brand-black)] text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </a>
              
              <button className="p-2 hover:bg-black/5 rounded-full transition-colors">
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
