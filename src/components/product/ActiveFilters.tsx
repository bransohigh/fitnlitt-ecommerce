import React from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ActiveFiltersProps {
  filters: {
    sizes: string[];
    colors: string[];
    collections: string[];
    inStock: boolean;
    onSale: boolean;
  };
  onRemoveSize: (size: string) => void;
  onRemoveColor: (color: string) => void;
  onRemoveCollection: (collection: string) => void;
  onRemoveStock: () => void;
  onRemoveSale: () => void;
  onClearAll: () => void;
}

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveSize,
  onRemoveColor,
  onRemoveCollection,
  onRemoveStock,
  onRemoveSale,
  onClearAll,
}) => {
  const hasActiveFilters =
    filters.sizes.length > 0 ||
    filters.colors.length > 0 ||
    filters.collections.length > 0 ||
    filters.inStock ||
    filters.onSale;

  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      <span className="text-sm font-medium text-gray-600">Aktif Filtreler:</span>

      {filters.sizes.map((size) => (
        <Badge key={size} variant="secondary" className="gap-1 pl-3 pr-2">
          Beden: {size}
          <button onClick={() => onRemoveSize(size)} className="hover:text-red-600">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {filters.colors.map((color) => (
        <Badge key={color} variant="secondary" className="gap-1 pl-3 pr-2">
          Renk: {color}
          <button onClick={() => onRemoveColor(color)} className="hover:text-red-600">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {filters.collections.map((collection) => (
        <Badge key={collection} variant="secondary" className="gap-1 pl-3 pr-2">
          {collection}
          <button onClick={() => onRemoveCollection(collection)} className="hover:text-red-600">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      ))}

      {filters.inStock && (
        <Badge variant="secondary" className="gap-1 pl-3 pr-2">
          Stokta var
          <button onClick={onRemoveStock} className="hover:text-red-600">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}

      {filters.onSale && (
        <Badge variant="secondary" className="gap-1 pl-3 pr-2">
          İndirimli
          <button onClick={onRemoveSale} className="hover:text-red-600">
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}

      <button
        onClick={onClearAll}
        className="text-sm text-[var(--primary-coral)] hover:text-[var(--primary-peach)] font-medium ml-2"
      >
        Tümünü Temizle
      </button>
    </div>
  );
};