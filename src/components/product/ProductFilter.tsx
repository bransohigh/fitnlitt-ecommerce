import React, { useState } from 'react';
import { X, ChevronDown, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';

export interface FilterState {
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  collections: string[];
  inStock: boolean;
  onSale: boolean;
}

interface ProductFilterProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  isMobile?: boolean;
}

const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableColors = [
  { name: 'Siyah', hex: '#000000' },
  { name: 'Beyaz', hex: '#FFFFFF' },
  { name: 'Pembe', hex: '#F06292' },
  { name: 'Mor', hex: '#AB47BC' },
  { name: 'Kırmızı', hex: '#D32F2F' },
  { name: 'Mavi', hex: '#1976D2' },
];

const availableCollections = [
  'Baddie Collection',
  'Timeless Collection',
  'Everyday Collection',
  'Latex Korse',
  'New In',
];

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  isMobile = false,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    size: true,
    color: true,
    price: true,
    collection: false,
    stock: true,
  });

  const toggleSize = (size: string) => {
    const newSizes = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFilterChange({ ...filters, sizes: newSizes });
  };

  const toggleColor = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFilterChange({ ...filters, colors: newColors });
  };

  const toggleCollection = (collection: string) => {
    const newCollections = filters.collections.includes(collection)
      ? filters.collections.filter((c) => c !== collection)
      : [...filters.collections, collection];
    onFilterChange({ ...filters, collections: newCollections });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({ ...expandedSections, [section]: !expandedSections[section] });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <h3 className="text-lg font-semibold">Filtreler</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-[var(--primary-coral)] hover:text-[var(--primary-peach)]"
        >
          Temizle
        </Button>
      </div>

      {/* Size Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium">Beden</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.size ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.size && (
          <div className="grid grid-cols-3 gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`py-2 px-4 border rounded-md text-sm font-medium transition-colors ${
                  filters.sizes.includes(size)
                    ? 'border-[var(--brand-black)] bg-[var(--brand-black)] text-white'
                    : 'border-gray-300 hover:border-[var(--brand-black)]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium">Renk</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.color ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.color && (
          <div className="grid grid-cols-4 gap-3">
            {availableColors.map((color) => (
              <button
                key={color.name}
                onClick={() => toggleColor(color.name)}
                className="group flex flex-col items-center gap-1"
              >
                <div
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    filters.colors.includes(color.name)
                      ? 'border-[var(--brand-black)] scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px #e5e5e5' : 'none',
                  }}
                />
                <span className="text-xs text-gray-600 text-center">{color.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium">Fiyat Aralığı</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.price && (
          <div className="space-y-4">
            <Slider
              min={0}
              max={2000}
              step={50}
              value={filters.priceRange}
              onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₺{filters.priceRange[0]}</span>
              <span>₺{filters.priceRange[1]}</span>
            </div>
          </div>
        )}
      </div>

      {/* Collection Filter */}
      <div className="space-y-3">
        <button
          onClick={() => toggleSection('collection')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium">Koleksiyon</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${expandedSections.collection ? 'rotate-180' : ''}`}
          />
        </button>
        {expandedSections.collection && (
          <div className="space-y-2">
            {availableCollections.map((collection) => (
              <div key={collection} className="flex items-center gap-2">
                <Checkbox
                  id={`collection-${collection}`}
                  checked={filters.collections.includes(collection)}
                  onCheckedChange={() => toggleCollection(collection)}
                />
                <Label htmlFor={`collection-${collection}`} className="text-sm cursor-pointer">
                  {collection}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stock & Sale Toggles */}
      <div className="space-y-3 pt-4 border-t">
        <div className="flex items-center gap-2">
          <Checkbox
            id="inStock"
            checked={filters.inStock}
            onCheckedChange={(checked) => onFilterChange({ ...filters, inStock: checked as boolean })}
          />
          <Label htmlFor="inStock" className="cursor-pointer">
            Sadece stokta olanlar
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="onSale"
            checked={filters.onSale}
            onCheckedChange={(checked) => onFilterChange({ ...filters, onSale: checked as boolean })}
          />
          <Label htmlFor="onSale" className="cursor-pointer">
            İndirimli ürünler
          </Label>
        </div>
      </div>
    </div>
  );

  // Mobile: Sheet component
  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full gap-2">
            <Sliders className="w-4 h-4" />
            Filtreler
            {(filters.sizes.length > 0 || filters.colors.length > 0) && (
              <Badge variant="secondary" className="ml-auto">
                {filters.sizes.length + filters.colors.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtreler</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterContent />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Sidebar
  return (
    <div className="bg-white rounded-lg border p-6 sticky top-24">
      <FilterContent />
    </div>
  );
};