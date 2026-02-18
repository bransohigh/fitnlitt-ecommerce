import { useState } from 'react';
import { X, ChevronDown, Sliders } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Facets } from '@/lib/api-client';

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
  facets?: Facets | null;
  isMobile?: boolean;
}

const defaultSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableColors = [
  { name: 'Siyah', hex: '#000000' },
  { name: 'Beyaz', hex: '#FFFFFF' },
  { name: 'Pembe', hex: '#F06292' },
  { name: 'Mor', hex: '#AB47BC' },
  { name: 'Kırmızı', hex: '#D32F2F' },
  { name: 'Mavi', hex: '#1976D2' },
  { name: 'Ten', hex: '#DDC4A5' },
  { name: 'Mercan', hex: '#FF6F61' },
  { name: 'Bordo', hex: '#800020' },
  { name: 'Lavanta', hex: '#E6E6FA' },
  { name: 'Lacivert', hex: '#000080' },
];

export const ProductFilter: React.FC<ProductFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  facets,
  isMobile = false,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    size: true,
    color: true,
    price: true,
    collection: false,
    stock: true,
  });

  // Get sizes from facets or fall back to defaults
  const availableSizes = facets?.sizes?.length 
    ? facets.sizes.map(s => ({ value: s.value, count: s.count }))
    : defaultSizes.map(s => ({ value: s, count: 0 }));

  // Get price range from facets
  const priceMin = facets?.price?.min || 0;
  const priceMax = facets?.price?.max || 2000;

  // Get color counts from facets
  const getColorCount = (colorName: string): number => {
    if (!facets?.colors) return 0;
    const facetColor = facets.colors.find(c => c.value === colorName);
    return facetColor?.count || 0;
  };

  // Get collections from facets
  const availableCollections = facets?.collections || [];

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
            {availableSizes.map((sizeOption) => {
              const isDisabled = sizeOption.count === 0;
              const isSelected = filters.sizes.includes(sizeOption.value);
              
              return (
                <button
                  key={sizeOption.value}
                  onClick={() => !isDisabled && toggleSize(sizeOption.value)}
                  disabled={isDisabled && !isSelected}
                  className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors relative ${
                    isSelected
                      ? 'border-[var(--brand-black)] bg-[var(--brand-black)] text-white'
                      : isDisabled
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 hover:border-[var(--brand-black)]'
                  }`}
                >
                  {sizeOption.value}
                  {sizeOption.count > 0 && !isSelected && (
                    <span className="text-xs text-gray-500 ml-1">({sizeOption.count})</span>
                  )}
                </button>
              );
            })}
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
            {availableColors.map((color) => {
              const count = getColorCount(color.name);
              const isDisabled = count === 0;
              const isSelected = filters.colors.includes(color.name);

              return (
                <button
                  key={color.name}
                  onClick={() => !isDisabled && toggleColor(color.name)}
                  disabled={isDisabled && !isSelected}
                  className={`group flex flex-col items-center gap-1 ${isDisabled && !isSelected ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      isSelected
                        ? 'border-[var(--brand-black)] scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{
                      backgroundColor: color.hex,
                      boxShadow: color.hex === '#FFFFFF' ? 'inset 0 0 0 1px #e5e5e5' : 'none',
                    }}
                  />
                  <span className="text-xs text-gray-600 text-center">
                    {color.name}
                    {count > 0 && !isSelected && <span className="text-gray-400"> ({count})</span>}
                  </span>
                </button>
              );
            })}
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
              min={priceMin}
              max={priceMax}
              step={50}
              value={filters.priceRange}
              onValueChange={(value) => onFilterChange({ ...filters, priceRange: value as [number, number] })}
              className="w-full"
            />
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>₺{filters.priceRange[0]}</span>
              <span>₺{filters.priceRange[1]}</span>
            </div>
            {(priceMin > 0 || priceMax < 2000) && (
              <p className="text-xs text-gray-500">Mevcut aralık: ₺{priceMin} - ₺{priceMax}</p>
            )}
          </div>
        )}
      </div>

      {/* Collection Filter */}
      {availableCollections.length > 0 && (
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
                <div key={collection.slug} className="flex items-center gap-2">
                  <Checkbox
                    id={`collection-${collection.slug}`}
                    checked={filters.collections.includes(collection.title)}
                    onCheckedChange={() => toggleCollection(collection.title)}
                  />
                  <Label htmlFor={`collection-${collection.slug}`} className="text-sm cursor-pointer flex-1">
                    {collection.title}
                    <span className="text-xs text-gray-500 ml-1">({collection.count})</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
    // Calculate total active filters
    const activeFilterCount =
      filters.sizes.length +
      filters.colors.length +
      filters.collections.length +
      (filters.inStock ? 1 : 0) +
      (filters.onSale ? 1 : 0) +
      (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 2000 ? 1 : 0);

    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full gap-2 h-11 font-medium">
            <Sliders className="w-4 h-4" />
            Filtreler
            {activeFilterCount > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto bg-[var(--primary-coral)] text-[var(--brand-black)] font-semibold"
              >
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filtreler</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {FilterContent()}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop: Sidebar
  return (
    <div className="bg-white rounded-lg border p-6 sticky top-24">
      {FilterContent()}
    </div>
  );
};