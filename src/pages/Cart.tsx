import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingBag, Shield, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const shippingThreshold = 500;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 50;
  const discountAmount = discountApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - discountAmount;

  const handleApplyDiscount = () => {
    if (discountCode.toUpperCase() === 'WELCOME10') {
      setDiscountApplied(true);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--brand-white)] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-medium mb-4">Sepetiniz Boş</h2>
          <p className="text-muted-foreground mb-8">
            Alışverişe başlamak için koleksiyonumuza göz atın
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)]"
          >
            <Link to="/collection">
              Alışverişe Başla
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--brand-white)]">
      <div className="container-custom py-12">
        <h1 className="mb-8">Sepetim ({items.length} Ürün)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}
                className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200"
              >
                {/* Product Image */}
                <a
                  href={`/products/${item.product.slug}`}
                  className="shrink-0 w-24 h-24 overflow-hidden rounded-lg bg-[var(--brand-cream)]"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </a>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <a href={`/products/${item.product.slug}`} className="hover:text-[var(--primary-coral)]">
                    <h3 className="font-medium text-[var(--brand-black)] mb-1 truncate">
                      {item.product.name}
                    </h3>
                  </a>
                  <p className="text-sm text-muted-foreground mb-2">
                    Beden: {item.selectedSize} | Renk: {item.selectedColor}
                  </p>
                  
                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="p-1 border rounded hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-1 border rounded hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price & Remove */}
                <div className="text-right space-y-2">
                  <p className="font-semibold text-[var(--brand-black)]">
                    {formatPrice(item.product.price * item.quantity)}₺
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-600 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            <Link
              to="/"
              className="inline-flex items-center text-sm text-[var(--primary-coral)] hover:text-[var(--primary-peach)] transition-colors"
            >
              ← Alışverişe Devam Et
            </Link>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-[var(--brand-cream)] rounded-xl p-6 space-y-4">
              <h3 className="text-xl font-medium mb-4">Sipariş Özeti</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span className="font-medium">{formatPrice(subtotal)}₺</span>
                </div>

                {subtotal < shippingThreshold && (
                  <div className="text-xs text-muted-foreground bg-white p-3 rounded">
                    Üretsiz kargo için {formatPrice(shippingThreshold - subtotal)}₺ daha alışveriş yapın!
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kargo</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-[var(--success-green)]' : ''}`}>
                    {shippingCost === 0 ? 'Ücretsiz' : `${formatPrice(shippingCost)}₺`}
                  </span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-[var(--success-green)]">
                    <span>İndirim</span>
                    <span className="font-medium">-{formatPrice(discountAmount)}₺</span>
                  </div>
                )}
              </div>

              {/* Discount Code */}
              <div className="pt-4 border-t">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="İndirim kodu"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    disabled={discountApplied}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={discountApplied}
                    variant="outline"
                    className="whitespace-nowrap"
                  >
                    {discountApplied ? '✓' : 'Uygula'}
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-semibold pt-4 border-t">
                <span>Toplam</span>
                <span>{formatPrice(total)}₺</span>
              </div>

              {/* Checkout Button */}
              <Link to="/checkout" className="w-full bg-[var(--brand-black)] hover:bg-[var(--brand-black)]/90 text-white py-4 text-lg rounded-md flex items-center justify-center font-medium">
                Ödemeye Geç
              </Link>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-2">
                <Shield className="w-4 h-4" />
                <span>iyzico ile güvenli ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
