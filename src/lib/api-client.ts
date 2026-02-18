/**
 * API Client — queries Supabase directly (works on static hosting, no Express needed)
 */
import { supabaseAuth } from './supabase-auth';

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

const API_BASE = '/api'; // kept for reference, not used

// ─── Internal helpers ────────────────────────────────────────────────────────

function formatProductRow(p: any): APIProduct {
  const now = new Date();
  const variants: any[] = p.variants ?? [];
  const images: any[] = (p.product_images ?? []).sort((a: any, b: any) => a.sort - b.sort);

  const sizes  = [...new Set<string>(variants.map((v) => v.size))];
  const colors = [...new Set<string>(variants.map((v) => v.color))];
  const priceOverrides = variants.map((v) => v.price_override).filter(Boolean);
  const totalStock = variants.reduce((s: number, v: any) => s + (v.stock ?? 0), 0);

  const price     = parseFloat(p.price);
  const compareAt = p.compare_at ? parseFloat(p.compare_at) : null;
  const daysDiff  = (now.getTime() - new Date(p.created_at).getTime()) / 86_400_000;

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    description: p.description ?? undefined,
    price,
    compare_at: compareAt,
    currency: p.currency,
    primaryImage: images[0] ? { url: images[0].url } : undefined,
    images: images.map((img) => ({ url: img.url, sort: img.sort })),
    variantsSummary: {
      sizes,
      colors,
      minPrice: priceOverrides.length ? Math.min(...priceOverrides) : null,
      maxPrice: priceOverrides.length ? Math.max(...priceOverrides) : null,
      inStock: totalStock > 0,
      totalStock,
    },
    badges: {
      isNew: daysDiff <= 21,
      isSale: !!(compareAt && compareAt > price),
      isLowStock: totalStock > 0 && totalStock <= 3,
      isFeatured: p.is_featured,
    },
    collection: p.collections
      ? {
          slug: p.collections.slug,
          title: p.collections.title,
          description: p.collections.description,
          hero_image: p.collections.hero_image,
        }
      : undefined,
    variants: variants.map((v) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku ?? '',
      price: v.price_override ? parseFloat(v.price_override) : parseFloat(p.price),
      stock: v.stock ?? 0,
      isInStock: (v.stock ?? 0) > 0,
    })),
  };
}

// ─── fetchProducts ────────────────────────────────────────────────────────────

/**
 * Fetch products with filters — queries Supabase directly.
 */
export async function fetchProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
  const page  = filters.page  ?? 1;
  const limit = filters.limit ?? 24;
  const offset = (page - 1) * limit;

  // 1. Resolve collection slug → id
  let collectionId: string | null = null;
  if (filters.collection) {
    const { data: col } = await supabaseAuth
      .from('collections')
      .select('id')
      .eq('slug', filters.collection)
      .maybeSingle();
    if (!col) {
      return { items: [], meta: { page, limit, total: 0, totalPages: 0, hasMore: false } };
    }
    collectionId = col.id;
  }

  // 2. Variant filters (size / color / stock) — resolve matching product ids first
  let variantIds: string[] | null = null;
  if (filters.sizes?.length || filters.colors?.length || filters.inStock) {
    let vq = supabaseAuth.from('variants').select('product_id');
    if (filters.sizes?.length)  vq = vq.in('size', filters.sizes);
    if (filters.colors?.length) vq = vq.in('color', filters.colors);
    if (filters.inStock)        vq = (vq as any).gt('stock', 0);
    const { data: vRows } = await vq;
    variantIds = [...new Set<string>((vRows ?? []).map((v: any) => v.product_id))];
    if (variantIds.length === 0) {
      return { items: [], meta: { page, limit, total: 0, totalPages: 0, hasMore: false } };
    }
  }

  // 3. Main products query
  let q = supabaseAuth
    .from('products')
    .select(
      `id, slug, title, description, price, compare_at, currency,
       is_active, is_featured, created_at,
       collections(id, slug, title, description, hero_image),
       product_images(url, sort),
       variants(id, size, color, sku, price_override, stock)`,
      { count: 'exact' }
    )
    .eq('is_active', true);

  if (collectionId)  q = q.eq('collection_id', collectionId);
  if (variantIds)    q = q.in('id', variantIds);
  if (filters.q)     q = q.ilike('title', `%${filters.q}%`);
  if (filters.priceMin !== undefined) q = q.gte('price', filters.priceMin);
  if (filters.priceMax !== undefined) q = q.lte('price', filters.priceMax);
  if (filters.onSale)    q = q.not('compare_at', 'is', null);
  if (filters.featured)  q = q.eq('is_featured', true);

  // Sorting
  switch (filters.sort) {
    case 'newest':     q = q.order('created_at', { ascending: false }); break;
    case 'price_asc':  q = q.order('price',       { ascending: true  }); break;
    case 'price_desc': q = q.order('price',       { ascending: false }); break;
    default:
      q = q.order('is_featured', { ascending: false });
      q = q.order('created_at',  { ascending: false });
  }

  q = q.range(offset, offset + limit - 1);

  const { data, error, count } = await q;
  if (error) {
    console.error('[api-client] fetchProducts error:', error.message);
    throw new Error(error.message);
  }

  const items = (data ?? []).map(formatProductRow);
  const total      = count ?? 0;
  const totalPages = Math.ceil(total / limit);

  return {
    items,
    meta: { page, limit, total, totalPages, hasMore: page < totalPages },
  };
}

// ─── fetchProduct (single) ────────────────────────────────────────────────────

export async function fetchProduct(slug: string): Promise<{ product: APIProduct }> {
  const { data: p, error } = await supabaseAuth
    .from('products')
    .select(
      `id, slug, title, description, price, compare_at, currency,
       is_active, is_featured, created_at,
       collections(id, slug, title, description, hero_image),
       product_images(url, sort),
       variants(id, size, color, sku, price_override, stock)`
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();

  if (error) {
    console.error('[api-client] fetchProduct error:', error.message);
    throw new Error(error.message);
  }
  if (!p) throw new Error(`Product '${slug}' not found`);

  return { product: formatProductRow(p) };
}

// ─── fetchCollections ─────────────────────────────────────────────────────────

export async function fetchCollections(): Promise<{ collections: Collection[]; meta: { total: number } }> {
  const { data, error } = await supabaseAuth
    .from('collections')
    .select('id, slug, title, description, hero_image, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[api-client] fetchCollections error:', error.message);
    throw new Error(error.message);
  }

  return { collections: data ?? [], meta: { total: data?.length ?? 0 } };
}

// ─── fetchCollection (single) ─────────────────────────────────────────────────

export async function fetchCollection(slug: string): Promise<{ collection: Collection }> {
  const { data, error } = await supabaseAuth
    .from('collections')
    .select('id, slug, title, description, hero_image, created_at')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error('[api-client] fetchCollection error:', error.message);
    throw new Error(error.message);
  }
  if (!data) throw new Error(`Collection '${slug}' not found`);

  return { collection: data as Collection };
}

// ─── fetchSearchSuggestions ───────────────────────────────────────────────────

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
  const { data, error } = await supabaseAuth
    .from('products')
    .select('slug, title, price, currency, collections(slug), product_images(url)')
    .eq('is_active', true)
    .ilike('title', `%${query}%`)
    .order('is_featured', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((p: any) => ({
    slug: p.slug,
    title: p.title,
    price: parseFloat(p.price),
    currency: p.currency,
    primaryImageUrl: p.product_images?.[0]?.url ?? null,
    collectionSlug: p.collections?.slug ?? null,
  }));
}

// ─── fetchFacets ──────────────────────────────────────────────────────────────

export async function fetchFacets(
  filters: Omit<ProductFilters, 'page' | 'limit' | 'include'>
): Promise<Facets> {
  // Resolve collection first
  let collectionId: string | null = null;
  if (filters.collection) {
    const { data: col } = await supabaseAuth
      .from('collections')
      .select('id')
      .eq('slug', filters.collection)
      .maybeSingle();
    collectionId = col?.id ?? null;
  }

  // Get matching product ids
  let pq = supabaseAuth
    .from('products')
    .select('id, price, collections(slug)')
    .eq('is_active', true);
  if (collectionId) pq = pq.eq('collection_id', collectionId);
  if (filters.q) pq = pq.ilike('title', `%${filters.q}%`);
  if (filters.onSale) pq = pq.not('compare_at', 'is', null);
  if (filters.featured) pq = pq.eq('is_featured', true);

  const { data: pRows } = await pq;
  const productIds = (pRows ?? []).map((p: any) => p.id);

  if (productIds.length === 0) {
    return { sizes: [], colors: [], price: { min: 0, max: 5000 } };
  }

  // Get variant facets
  const { data: vRows } = await supabaseAuth
    .from('variants')
    .select('size, color, stock, product_id')
    .in('product_id', productIds);

  const sizeMap:  Record<string, number> = {};
  const colorMap: Record<string, number> = {};
  (vRows ?? []).forEach((v: any) => {
    if (v.size)  sizeMap[v.size]   = (sizeMap[v.size]   ?? 0) + 1;
    if (v.color) colorMap[v.color] = (colorMap[v.color] ?? 0) + 1;
  });

  const prices = (pRows ?? []).map((p: any) => parseFloat(p.price)).filter(Boolean);

  return {
    sizes:  Object.entries(sizeMap).map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value)),
    colors: Object.entries(colorMap).map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value)),
    price:  { min: prices.length ? Math.min(...prices) : 0, max: prices.length ? Math.max(...prices) : 5000 },
  };
}
