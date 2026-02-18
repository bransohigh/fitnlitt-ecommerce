// Type definitions used across the app.
// Static data removed — all products/collections come from Supabase via AppDataContext.

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  colors: {
    name: string;
    hex: string;
    image: string;
  }[];
  sizes: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  fabric: string;
  care: string;
  category: string;
  inStock?: boolean;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productIds: string[];
}

// Empty — components read from AppDataContext (src/context/AppDataContext.tsx)
export const products: Product[] = [];
export const collections: Collection[] = [];
