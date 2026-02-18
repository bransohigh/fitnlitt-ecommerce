import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { ProductFilter, FilterState } from '@/components/product/ProductFilter';
import { ActiveFilters } from '@/components/product/ActiveFilters';
import { SearchBar } from '@/components/product/SearchBar';
import { Product } from '@/data/products';
import { fetchProducts, fetchCollection, type APIProduct, type Facets, type Collection } from '@/lib/api-client';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

type SortOption = 'recommended' | 'price_asc' | 'price_desc' | 'newest';

export const Collection: React.FC = () => {
  const { slug: propCollectionSlug } = useParams<{ slug: string }>();
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // API Data
  const [products, setProducts] = useState<APIProduct[]>([]);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [facets, setFacets] = useState<Facets | null>(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  
  const productsPerPage = 24;
  
  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 400);

  // Get collection slug from prop or URL
  const getCollectionSlug = (): string | null => {
    if (propCollectionSlug) return propCollectionSlug;
    return null;
  };

  // Parse URL query params on mount to restore filters
  useEffect(() => {
    const queryString = window.location.search.slice(1);
    if (!queryString) {
      setIsInitialized(true);
      return;
    }

    const params = new URLSearchParams(queryString);
    const newFilters: FilterState = { ...filters };
    let hasChanges = false;

    // Parse sizes
    const sizesParam = params.get('sizes');
    if (sizesParam) {
      newFilters.sizes = sizesParam.split(',').filter(Boolean);
      hasChanges = true;
    }

    // Parse colors
    const colorsParam = params.get('colors');
    if (colorsParam) {
      newFilters.colors = decodeURIComponent(colorsParam).split(',').filter(Boolean);
      hasChanges = true;
    }

    // Parse price range
    const minPrice = params.get('priceMin');
    const maxPrice = params.get('priceMax');
    if (minPrice || maxPrice) {
      newFilters.priceRange = [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 2000
      ];
      hasChanges = true;
    }

    // Parse collections
    const collectionsParam = params.get('collections');
    if (collectionsParam) {
      newFilters.collections = decodeURIComponent(collectionsParam).split(',').filter(Boolean);
      hasChanges = true;
    }

    // Parse boolean flags
    if (params.get('inStock') === 'true') {
      newFilters.inStock = true;
      hasChanges = true;
    }
    if (params.get('onSale') === 'true') {
      newFilters.onSale = true;
      hasChanges = true;
    }

    // Parse search query
    const qParam = params.get('q');
    if (qParam) {
      setSearchQuery(qParam);
    }

    // Parse sort
    const sortParam = params.get('sort');
    if (sortParam && ['recommended', 'price_asc', 'price_desc', 'newest'].includes(sortParam)) {
      setSortBy(sortParam as SortOption);
    }

    // Parse page
    const pageParam = params.get('page');
    if (pageParam) {
      setCurrentPage(parseInt(pageParam) || 1);
    }

    if (hasChanges) {
      setFilters(newFilters);
    }
    setIsInitialized(true);
  }, []);

  // Update URL when filters, sort, search, or page change
  useEffect(() => {
    if (!isInitialized) return; // Don't update URL on initial load

    const params = new URLSearchParams();

    // Add search query
    if (debouncedSearchQuery) {
      params.set('q', debouncedSearchQuery);
    }

    // Add filters to URL
    if (filters.sizes.length > 0) {
      params.set('sizes', filters.sizes.join(','));
    }
    if (filters.colors.length > 0) {
      params.set('colors', encodeURIComponent(filters.colors.join(',')));
    }
    if (filters.priceRange[0] !== 0 || filters.priceRange[1] !== 2000) {
      params.set('priceMin', filters.priceRange[0].toString());
      params.set('priceMax', filters.priceRange[1].toString());
    }
    if (filters.collections.length > 0) {
      params.set('collections', encodeURIComponent(filters.collections.join(',')));
    }
    if (filters.inStock) {
      params.set('inStock', 'true');
    }
    if (filters.onSale) {
      params.set('onSale', 'true');
    }
    if (sortBy !== 'recommended') {
      params.set('sort', sortBy);
    }
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }

    // Update URL without page reload (use real search params, not hash)
    const queryString = params.toString();
    const newUrl = window.location.pathname + (queryString ? `?${queryString}` : '');
    window.history.replaceState(null, '', newUrl);
  }, [filters, sortBy, debouncedSearchQuery, currentPage, isInitialized]);

  // Fetch collection info
  useEffect(() => {
    const collectionSlug = getCollectionSlug();
    if (!collectionSlug) {
      setCollection(null);
      return;
    }

    fetchCollection(collectionSlug)
      .then(({ collection }) => setCollection(collection))
      .catch(err => {
        console.error('Failed to fetch collection:', err);
        // Don't block if collection fetch fails
      });
  }, []);

  // Fetch products when filters, sort, search, or page change
  const fetchProductsData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const collectionSlug = getCollectionSlug();
      
      const response = await fetchProducts({
        collection: collectionSlug || undefined,
        q: debouncedSearchQuery || undefined,
        sort: sortBy === 'recommended' ? undefined : sortBy,
        page: currentPage,
        limit: productsPerPage,
        sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
        colors: filters.colors.length > 0 ? filters.colors : undefined,
        priceMin: filters.priceRange[0] !== 0 ? filters.priceRange[0] : undefined,
        priceMax: filters.priceRange[1] !== 2000 ? filters.priceRange[1] : undefined,
        inStock: filters.inStock || undefined,
        onSale: filters.onSale || undefined,
        include: ['images', 'collection'],
      });

      setProducts(response.items);
      setTotalProducts(response.meta.total);
      setTotalPages(response.meta.totalPages);
      setFacets(response.facets || null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Ürünler yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sortBy, debouncedSearchQuery, currentPage]);

  useEffect(() => {
    if (isInitialized) {
      fetchProductsData();
    }
  }, [fetchProductsData, isInitialized]);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  // Filter handlers
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1 when filters change
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
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleRemoveSize = (size: string) => {
    setFilters({ ...filters, sizes: filters.sizes.filter((s) => s !== size) });
    setCurrentPage(1);
  };

  const handleRemoveColor = (color: string) => {
    setFilters({ ...filters, colors: filters.colors.filter((c) => c !== color) });
    setCurrentPage(1);
  };

  const handleRemoveCollection = (collection: string) => {
    setFilters({ ...filters, collections: filters.collections.filter((c) => c !== collection) });
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to page 1 when search changes
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1); // Reset to page 1 when sort changes
  };

  // Convert API product to legacy Product format for ProductCard
  const convertToLegacyProduct = (apiProduct: APIProduct): Product => {
    return {
      id: apiProduct.id,
      name: apiProduct.title,
      price: apiProduct.price,
      compareAtPrice: apiProduct.compare_at || undefined,
      images: apiProduct.images?.map(img => img.url) || [apiProduct.primaryImage?.url || ''],
      colors: apiProduct.variantsSummary.colors.map(color => ({
        name: color,
        hex: '#000000', // Default color, not provided by API
      })),
      sizes: apiProduct.variantsSummary.sizes,
      category: apiProduct.collection?.title || '',
      rating: 4.5, // Default rating
      reviewCount: 0,
      badge: apiProduct.badges.isNew ? 'Yeni' : apiProduct.badges.isSale ? 'İndirim' : undefined,
      inStock: apiProduct.variantsSummary.inStock,
    };
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Collection Banner */}
      {collection ? (
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={collection.hero_image}
            alt={collection.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <div className="container-custom pb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{collection.title}</h1>
              <p className="text-lg text-gray-200 max-w-2xl">{collection.description}</p>
            </div>
          </div>
        </section>
      ) : sortBy === 'newest' ? (
        <section className="bg-[var(--brand-cream)] py-12">
          <div className="container-custom">
            <p className="eyebrow-text mb-3 text-[var(--primary-coral)]">Koleksiyon</p>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--brand-black)]">Yeni Ürünler</h1>
            <p className="text-gray-600 mt-3 max-w-xl">En yeni ürünleri keşfet, stilini tazele.</p>
          </div>
        </section>
      ) : null}

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
                facets={facets}
              />
            </aside>

            {/* Products Section */}
            <div className="space-y-6">
              {/* Search Bar */}
              <SearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Ürün ara..."
                className="w-full"
              />

              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Mobile Filter Button */}
                <div className="lg:hidden w-full sm:w-auto">
                  <ProductFilter
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    facets={facets}
                    isMobile
                  />
                </div>

                {/* Product Count */}
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    <Skeleton className="h-5 w-32" />
                  ) : (
                    <>
                      <span className="font-semibold">{totalProducts}</span> ürün gösteriliyor
                    </>
                  )}
                </div>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Sırala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Önerilen</SelectItem>
                    <SelectItem value="price_asc">Fiyat (Artan)</SelectItem>
                    <SelectItem value="price_desc">Fiyat (Azalan)</SelectItem>
                    <SelectItem value="newest">Yeni Gelenler</SelectItem>
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

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-800 font-medium">Hata</p>
                    <p className="text-red-700 text-sm">{error}</p>
                    <Button
                      onClick={fetchProductsData}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Tekrar Dene
                    </Button>
                  </div>
                </div>
              )}

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
              ) : products.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-lg text-gray-600 mb-6">
                    {searchQuery
                      ? `"${searchQuery}" için sonuç bulunamadı.`
                      : 'Aradığınız kriterlere uygun ürün bulunamadı.'}
                  </p>
                  <Button onClick={handleClearFilters} variant="outline">
                    Filtreleri Temizle
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((apiProduct) => (
                    <ProductCard 
                      key={apiProduct.id} 
                      product={convertToLegacyProduct(apiProduct)} 
                      onQuickView={handleOpenQuickView} 
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && !isLoading && (
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
