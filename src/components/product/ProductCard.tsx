import React, { useState } from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToCart } = useCart();

  // Show selected color's image, or fallback to hover/default image
  const currentImage = selectedColor.image || (isHovered && product.images[1] ? product.images[1] : product.images[0]);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, product.sizes[0], selectedColor.name, 1);
  };

  return (
    <a
      href="#product"
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg bg-[var(--brand-cream)] aspect-[3/4]">
        {/* Product Image */}
        <img
          src={currentImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-[var(--brand-black)] text-[var(--brand-white)] px-3 py-1 rounded-full text-xs font-medium">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full hover:bg-white transition-all"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-[var(--brand-black)]'
            }`}
          />
        </button>

        {/* Quick Add Button - Shows on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <Button
            onClick={handleQuickAdd}
            className="w-full bg-[var(--brand-black)] text-[var(--brand-white)] hover:bg-[var(--primary-coral)] hover:text-[var(--brand-black)] gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            Sepete Ekle
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-3 space-y-2">
        <h3 className="text-sm font-medium text-[var(--brand-black)] line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-yellow-500">★</span>
          <span className="text-[var(--brand-black)]">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-[var(--brand-black)]">
            {product.price}₺
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                {product.compareAtPrice}₺
              </span>
              <span className="text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">
                %{discountPercent}
              </span>
            </>
          )}
        </div>

        {/* Color Swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-2">
            {product.colors.map((color) => (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(color);
                }}
                className={`w-5 h-5 rounded-full border-2 transition-all ${
                  selectedColor.name === color.name
                    ? 'border-[var(--brand-black)] scale-110'
                    : 'border-gray-300'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            ))}
          </div>
        )}
      </div>
    </a>
  );
};
