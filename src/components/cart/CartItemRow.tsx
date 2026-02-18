import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, X } from 'lucide-react';
import { Product } from '@/data/products';
import { config } from '@/lib/config';

interface CartItemRowProps {
  product: Product;
  quantity: number;
  selectedSize: string;
  selectedColor: string;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  product,
  quantity,
  selectedSize,
  selectedColor,
  onUpdateQuantity,
  onRemove,
}) => {
  const itemTotal = product.price * quantity;
  const canDecrease = quantity > 1;
  const canIncrease = quantity < config.MAX_CART_QUANTITY;
  const productUrl = `/product/${product.slug}`;

  return (
    <div className="flex gap-4 p-4 hover:bg-gray-50 transition-colors group">
      {/* Product Image */}
      <Link to={productUrl} className="flex-shrink-0">
        <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--brand-cream)]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={productUrl} className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[var(--primary-coral)] transition-colors">
              {product.name}
            </h4>
          </Link>
          <button
            onClick={onRemove}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            aria-label="Ürünü kaldır"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Variant Info */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="font-medium">Beden:</span>
            <span className="px-2 py-0.5 bg-gray-100 rounded font-medium">{selectedSize}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span className="font-medium">Renk:</span>
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-full border border-gray-300"
                style={{
                  backgroundColor:
                    product.colors.find((c) => c.name === selectedColor)?.hex || '#000',
                }}
              />
              {selectedColor}
            </span>
          </div>
        </div>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[var(--brand-black)]">
            {itemTotal}₺
          </span>

          {/* Quantity Stepper */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => onUpdateQuantity(quantity - 1)}
              disabled={!canDecrease}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Azalt"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              onClick={() => onUpdateQuantity(quantity + 1)}
              disabled={!canIncrease}
              className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Artır"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
