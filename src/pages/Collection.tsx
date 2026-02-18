import React, { useState, useMemo } from 'react';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { ProductFilter, FilterState } from '@/components/product/ProductFilter';
import { ActiveFilters } from '@/components/product/ActiveFilters';
import { products, collections, Product } from '@/data/products';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type SortOption = 'recommended' | 'price-asc' | 'price-desc' | 'newest' | 'bestsellers';

export const Collection: React.FC = () => {
  // State management
  const [filters, setFilters] = useState<FilterState>({
    sizes: [],
    colors: [],
    priceRange: [0, 2000],
    collections: [],
    inStock: false,
    onSale: false,
  });
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const productsPerPage = 12;

  // Get collection info (for demo, using first collection)
  const collection = collections[0];

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply size filter
    if (filters.sizes.length > 0) {
      filtered = filtered.filter((p) => p.sizes.some((s) => filters.sizes.includes(s)));
    }

    // Apply color filter
    if (filters.colors.length > 0) {
      filtered = filtered.filter((p) => p.colors.some((c) => filters.colors.includes(c.name)));
    }

    // Apply price range filter
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Apply collection filter
    if (filters.collections.length > 0) {
      filtered = filtered.filter((p) => filters.collections.includes(p.category));
    }

    // Apply on sale filter
    if (filters.onSale) {
      filtered = filtered.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (a.badge === 'Yeni' ? -1 : 1));
        break;
      case 'bestsellers':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return filtered;
  }, [filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Filter handlers
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      sizes: [],
      colors: [],
      priceRange: [0, 2000],
      collections: [],
      inStock: false,
      onSale: false,
    });
    setCurrentPage(1);
  };

  const handleRemoveSize = (size: string) => {
    setFilters({ ...filters, sizes: filters.sizes.filter((s) => s !== size) });
  };

  const handleRemoveColor = (color: string) => {
    setFilters({ ...filters, colors: filters.colors.filter((c) => c !== color) });
  };

  const handleRemoveCollection = (collection: string) => {
    setFilters({ ...filters, collections: filters.collections.filter((c) => c !== collection) });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Collection Banner */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <img
          src={collection.image}
          alt={collection.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container-custom pb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{collection.name}</h1>
            <p className="text-lg text-gray-200 max-w-2xl">{collection.description}</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Desktop Filter Sidebar */}
            <aside className="hidden lg:block">
              <ProductFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </aside>

            {/* Products Section */}
            <div className="space-y-6">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Mobile Filter Button */}
                <div className="lg:hidden w-full sm:w-auto">
                  <ProductFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    isMobile
                  />
                </div>

                {/* Product Count */}
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">{filteredProducts.length}</span> ürün gösteriliyor
                </div>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Sırala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Önerilen</SelectItem>
                    <SelectItem value="price-asc">Fiyat (Artan)</SelectItem>
                    <SelectItem value="price-desc">Fiyat (Azalan)</SelectItem>
                    <SelectItem value="newest">Yeni Gelenler</SelectItem>
                    <SelectItem value="bestsellers">Çok Satanlar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              <ActiveFilters
                filters={filters}
                onRemoveSize={handleRemoveSize}
                onRemoveColor={handleRemoveColor}
                onRemoveCollection={handleRemoveCollection}
                onRemoveStock={() => setFilters({ ...filters, inStock: false })}
                onRemoveSale={() => setFilters({ ...filters, onSale: false })}
                onClearAll={handleClearFilters}
              />

              {/* Product Grid */}
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {Array.from({ length: productsPerPage }).map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-gray-600 mb-6">
                    Aradığınız kriterlere uygun ürün bulunamadı.
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Filtreleri Temizle
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onQuickView={handleOpenQuickView} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Önceki
                  </Button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page;
                    if (totalPages <= 5) {
                      page = i + 1;
                    } else if (currentPage <= 3) {
                      page = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      page = totalPages - 4 + i;
                    } else {
                      page = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'bg-[var(--brand-black)]' : ''}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Sonraki
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};
