import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductBadge } from './ProductBadge';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  // Image logic: selected color image > hover secondary > default
  const getDisplayImage = () => {
    if (selectedColor.image) return selectedColor.image;
    if (isHovered && product.images[1]) return product.images[1];
    return product.images[0];
  };

  const currentImage = getDisplayImage();
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  // Determine if product is single-variant (can quick add) or multi-variant (needs options)
  const isSingleVariant = product.colors.length === 1 && product.sizes.length === 1;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSingleVariant) {
      addToCart(product, product.sizes[0], product.colors[0].name, 1);
    } else {
      // Open quick view for multi-variant products
      onQuickView?.(product);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  // Determine badge type
  const getBadgeType = (): 'new' | 'sale' | 'bestseller' | 'low-stock' | null => {
    if (product.badge === 'Yeni') return 'new';
    if (product.badge === 'Çok Satan') return 'bestseller';
    if (hasDiscount) return 'sale';
    // Could add low-stock logic here based on inventory
    return null;
  };

  const badgeType = getBadgeType();

  return (
    <div
      className="group block cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => window.location.href = '#product'}
    >
      <div className="relative overflow-hidden rounded-xl bg-[var(--brand-cream)] aspect-[3/4] shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        {/* Product Image */}
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        {/* Gradient Overlay on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badge */}
        {badgeType && (
          <div className="absolute top-3 left-3 z-10">
            <ProductBadge type={badgeType} discount={badgeType === 'sale' ? discountPercent : undefined} />
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 ${
            isWishlisted
              ? 'bg-red-500 hover:bg-red-600 scale-110'
              : 'bg-white/90 hover:bg-white'
          }`}
          aria-label={isWishlisted ? 'Favorilerden çıkar' : 'Favorilere ekle'}
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isWishlisted ? 'fill-white text-white' : 'text-[var(--brand-black)]'
            }`}
          />
        </button>

        {/* Quick View Button - Appears on Hover */}
        {onQuickView && (
          <button
            onClick={handleQuickViewClick}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 p-3 bg-white rounded-full shadow-lg transition-all duration-300 ${
              isHovered
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-75 pointer-events-none'
            }`}
            aria-label="Hızlı Görünüm"
          >
            <Eye className="w-5 h-5 text-[var(--brand-black)]" />
          </button>
        )}

        {/* Action Buttons - Show on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <Button
            onClick={handleQuickAdd}
            className="w-full bg-[var(--brand-black)] text-white hover:bg-[var(--primary-coral)] hover:text-[var(--brand-black)] gap-2 shadow-xl h-11 font-semibold"
          >
            {isSingleVariant ? (
              <>
                <ShoppingBag className="w-4 h-4" />
                Sepete Ekle
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Seçenekleri Gör
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-2">
        <h3 className="text-sm font-medium text-[var(--brand-black)] line-clamp-2 group-hover:text-[var(--primary-coral)] transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-[var(--brand-black)] font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-[var(--brand-black)]">
            {product.price}₺
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {product.compareAtPrice}₺
              </span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                %{discountPercent} İndirim
              </span>
            </>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 5).map((color) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  selectedColor.name === color.name
                    ? 'border-[var(--brand-black)] ring-2 ring-offset-1 ring-[var(--brand-black)]'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
                aria-label={`${color.name} rengini seç`}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{product.colors.length - 5}
              </span>
            )}
          </div>
        )}

        {/* Size indicator for multi-size products */}
        {product.sizes.length > 1 && (
          <div className="text-xs text-muted-foreground">
            {product.sizes.length} beden seçeneği
          </div>
        )}
      </div>
    </div>
  );
};
