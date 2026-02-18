/**
 * API Client for fetching products and collections
 * Integrates with Express API server running on port 3001
 */

export interface ProductImage {
  url: string;
  sort: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
  isInStock: boolean;
}

export interface ProductBadges {
  isNew: boolean;
  isSale: boolean;
  isLowStock: boolean;
  isFeatured: boolean;
}

export interface VariantsSummary {
  sizes: string[];
  colors: string[];
  minPrice: number | null;
  maxPrice: number | null;
  inStock: boolean;
  totalStock: number;
}

export interface APIProduct {
  id: string;
  slug: string;
  title: string;
  description?: string;
  price: number;
  compare_at: number | null;
  currency: string;
  primaryImage?: { url: string };
  images?: ProductImage[];
  variantsSummary: VariantsSummary;
  badges: ProductBadges;
  collection?: {
    slug: string;
    title: string;
    description: string;
    hero_image: string;
  };
  variants?: ProductVariant[];
}

export interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string;
  hero_image: string;
  created_at: string;
}

export interface FacetOption {
  value: string;
  count: number;
}

export interface CollectionFacet {
  slug: string;
  title: string;
  count: number;
}

export interface Facets {
  sizes: FacetOption[];
  colors: FacetOption[];
  price: {
    min: number;
    max: number;
  };
  collections?: CollectionFacet[];
}

export interface ProductsResponse {
  items: APIProduct[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
  facets?: Facets;
}

export interface ProductFilters {
  collection?: string;
  collections?: string[];
  q?: string;
  sort?: 'recommended' | 'newest' | 'price_asc' | 'price_desc';
  page?: number;
  limit?: number;
  sizes?: string[];
  colors?: string[];
  priceMin?: number;
  priceMax?: number;
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  include?: string[];
}

const API_BASE = '/api';

/**
 * Fetch products with filters
 */
export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  // Add filter params
  if (filters.collection) params.set('collection', filters.collection);
  if (filters.collections?.length) params.set('collections', filters.collections.join(','));
  if (filters.q) params.set('q', filters.q);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.page) params.set('page', filters.page.toString());
  if (filters.limit) params.set('limit', filters.limit.toString());
  if (filters.sizes?.length) params.set('sizes', filters.sizes.join(','));
  if (filters.colors?.length) params.set('colors', filters.colors.join(','));
  if (filters.priceMin !== undefined) params.set('priceMin', filters.priceMin.toString());
  if (filters.priceMax !== undefined) params.set('priceMax', filters.priceMax.toString());
  if (filters.inStock) params.set('inStock', 'true');
  if (filters.onSale) params.set('onSale', 'true');
  if (filters.featured) params.set('featured', 'true');
  if (filters.include?.length) params.set('include', filters.include.join(','));

  const response = await fetch(`${API_BASE}/products?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch single product by slug
 */
export async function fetchProduct(slug: string): Promise<{ product: APIProduct }> {
  const response = await fetch(`${API_BASE}/products/${slug}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch all collections
 */
export async function fetchCollections(): Promise<{ collections: Collection[]; meta: { total: number } }> {
  const response = await fetch(`${API_BASE}/collections`);

  if (!response.ok) {
    throw new Error(`Failed to fetch collections: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch single collection by slug
 */
export async function fetchCollection(slug: string): Promise<{ collection: Collection }> {
  const response = await fetch(`${API_BASE}/collections/${slug}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch collection: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch search suggestions
 */
export async function fetchSearchSuggestions(
  query: string,
  limit = 8
): Promise<Array<{
  slug: string;
  title: string;
  price: number;
  currency: string;
  primaryImageUrl: string | null;
  collectionSlug: string | null;
}>> {
  const params = new URLSearchParams({ q: query, limit: limit.toString() });
  const response = await fetch(`${API_BASE}/search/suggest?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch suggestions: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetch facets for filtering
 */
export async function fetchFacets(filters: Omit<ProductFilters, 'page' | 'limit' | 'include'>): Promise<Facets> {
  const params = new URLSearchParams();

  if (filters.collection) params.set('collection', filters.collection);
  if (filters.collections?.length) params.set('collections', filters.collections.join(','));
  if (filters.q) params.set('q', filters.q);
  if (filters.sizes?.length) params.set('sizes', filters.sizes.join(','));
  if (filters.colors?.length) params.set('colors', filters.colors.join(','));
  if (filters.priceMin !== undefined) params.set('priceMin', filters.priceMin.toString());
  if (filters.priceMax !== undefined) params.set('priceMax', filters.priceMax.toString());
  if (filters.inStock) params.set('inStock', 'true');
  if (filters.onSale) params.set('onSale', 'true');
  if (filters.featured) params.set('featured', 'true');

  const response = await fetch(`${API_BASE}/facets?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch facets: ${response.statusText}`);
  }

  return response.json();
}
