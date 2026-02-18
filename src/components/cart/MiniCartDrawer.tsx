import React, { useEffect } from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { CartItemRow } from './CartItemRow';
import { FreeShippingProgress } from './FreeShippingProgress';
import { Button } from '@/components/ui/button';

interface MiniCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MiniCartDrawer: React.FC<MiniCartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, subtotal, totalItems, updateQuantity, removeFromCart } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
            role="dialog"
            aria-labelledby="cart-drawer-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-700" />
                <h2 id="cart-drawer-title" className="text-lg font-semibold text-gray-900">
                  Sepetim
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      ({totalItems} ürün)
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Sepeti kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            {totalItems > 0 && <FreeShippingProgress subtotal={subtotal} />}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Sepetiniz boş
                  </h3>
                  <p className="text-sm text-gray-500 mb-6">
                    Alışverişe başlamak için ürünleri sepetinize ekleyin
                  </p>
                  <Button
                    onClick={onClose}
                    className="bg-[var(--brand-black)] hover:bg-gray-800 text-white"
                  >
                    Alışverişe Devam Et
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item, index) => (
                    <CartItemRow
                      key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}-${index}`}
                      product={item.product}
                      quantity={item.quantity}
                      selectedSize={item.selectedSize}
                      selectedColor={item.selectedColor}
                      onUpdateQuantity={(qty) =>
                        updateQuantity(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor,
                          qty
                        )
                      }
                      onRemove={() =>
                        removeFromCart(
                          item.product.id,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4 bg-gray-50">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg">
                  <span className="font-medium text-gray-700">Ara Toplam:</span>
                  <span className="font-bold text-[var(--brand-black)] text-xl">
                    {subtotal}₺
                  </span>
                </div>

                {/* Info Text */}
                <p className="text-xs text-gray-500 text-center">
                  Kargo ve vergiler ödeme sırasında hesaplanacaktır
                </p>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      window.location.href = '#checkout';
                      onClose();
                    }}
                    className="w-full bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-white font-semibold h-12 text-base group"
                  >
                    Hemen Al
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button
                    onClick={() => {
                      window.location.href = '#cart';
                      onClose();
                    }}
                    variant="outline"
                    className="w-full border-2 border-gray-300 hover:border-[var(--brand-black)] hover:bg-gray-50 font-medium h-12 text-base"
                  >
                    Sepeti Görüntüle
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
