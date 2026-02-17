import React from 'react';
import { Check } from 'lucide-react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  stockStatus?: Record<string, boolean>; // size -> inStock
}

interface ColorSelectorProps {
  colors: Array<{ name: string; hex: string; image: string }>;
  selectedColor: string;
  onSelectColor: (colorName: string) => void;
}

export const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSelectSize,
  stockStatus = {},
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">Beden Seç</label>
        <button className="text-sm text-[var(--primary-coral)] hover:underline">
          Beden Rehberi
        </button>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {sizes.map((size) => {
          const isInStock = stockStatus[size] !== false;
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              onClick={() => isInStock && onSelectSize(size)}
              disabled={!isInStock}
              className={`relative py-3 px-4 border-2 rounded-lg text-sm font-medium transition-all ${
                isSelected
                  ? 'border-[var(--brand-black)] bg-[var(--brand-black)] text-white'
                  : isInStock
                  ? 'border-gray-300 hover:border-[var(--brand-black)]'
                  : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through'
              }`}
            >
              {size}
              {isSelected && (
                <Check className="absolute top-1 right-1 w-3 h-3" />
              )}
            </button>
          );
        })}
      </div>
      {selectedSize && stockStatus[selectedSize] === false && (
        <p className="text-sm text-red-600">Bu beden şu anda stokta yok</p>
      )}
    </div>
  );
};

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onSelectColor,
}) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-900">Renk Seç</label>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = selectedColor === color.name;

          return (
            <button
              key={color.name}
              onClick={() => onSelectColor(color.name)}
              className="group relative flex flex-col items-center gap-2"
              title={color.name}
            >
              <div
                className={`relative w-12 h-12 rounded-full border-2 transition-all ${
                  isSelected
                    ? 'border-[var(--brand-black)] scale-110 ring-2 ring-offset-2 ring-[var(--brand-black)]'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                style={{
                  backgroundColor: color.hex,
                  boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px #e5e5e5' : 'none',
                }}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="w-5 h-5 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <span className={`text-xs ${isSelected ? 'font-semibold' : 'text-gray-600'}`}>
                {color.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};