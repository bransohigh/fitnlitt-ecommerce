/**
 * AppDataContext — fetches collections + featured products from Supabase ONCE
 * and shares them across the whole app (Header, MegaMenu, Home, Loyalty, SearchBar…).
 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  fetchCollections,
  fetchProducts,
  APIProduct,
  Collection as APICollection,
} from '@/lib/api-client';
import { Product, Collection } from '@/data/products';

// ─── Adapters ─────────────────────────────────────────────────────────────────

/** Convert API collection → legacy Collection shape used by Header/MegaMenu/CollectionCard */
export function adaptCollection(c: APICollection): Collection {
  return {
    id: c.id,
    name: c.title,
    slug: c.slug,
    description: c.description ?? '',
    image: c.hero_image ?? '',
    productIds: [],
  };
}

/** Convert API product → legacy Product shape used by ProductCard/QuickViewModal */
export function adaptProduct(p: APIProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.title,
    description: p.description ?? '',
    price: p.price,
    compareAtPrice: p.compare_at ?? undefined,
    images: p.images?.map((i) => i.url) ?? (p.primaryImage ? [p.primaryImage.url] : []),
    colors:
      p.variantsSummary.colors.length > 0
        ? p.variantsSummary.colors.map((c) => ({
            name: c,
            hex: '#000000',
            image: p.primaryImage?.url ?? '',
          }))
        : [{ name: 'Default', hex: '#000000', image: p.primaryImage?.url ?? '' }],
    sizes:
      p.variantsSummary.sizes.length > 0 ? p.variantsSummary.sizes : ['One Size'],
    badge: p.badges.isNew ? 'Yeni' : p.badges.isSale ? 'İndirim' : undefined,
    rating: 4.5,
    reviewCount: 0,
    fabric: '',
    care: '',
    category: p.collection?.title ?? '',
    inStock: p.variantsSummary.inStock,
  };
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppDataContextValue {
  /** Legacy Collection[] — for Header, MegaMenu, SearchBar, CollectionCard */
  collections: Collection[];
  /** Raw APICollection[] — for MegaMenu (uses slug/title/hero_image directly) */
  apiCollections: APICollection[];
  /** Legacy Product[] — for Home hero, best sellers, Loyalty, StoryBlock hotspots */
  featuredProducts: Product[];
  loading: boolean;
}

const AppDataContext = createContext<AppDataContextValue>({
  collections: [],
  apiCollections: [],
  featuredProducts: [],
  loading: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [apiCollections, setApiCollections] = useState<APICollection[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchCollections(),
      fetchProducts({ limit: 12, sort: 'recommended' }),
    ])
      .then(([colRes, prodRes]) => {
        console.log('[AppData] collections:', colRes.collections.length, 'products:', prodRes.items.length);
        setApiCollections(colRes.collections);
        setCollections(colRes.collections.map(adaptCollection));
        setFeaturedProducts(prodRes.items.map(adaptProduct));
      })
      .catch((err) => {
        console.error('[AppData] fetch error:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <AppDataContext.Provider value={{ collections, apiCollections, featuredProducts, loading }}>
      {children}
    </AppDataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppData() {
  return useContext(AppDataContext);
}
