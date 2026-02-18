import { useState, useEffect } from 'react';
import { Product } from '@/data/products';
import { config } from '@/lib/config';

interface WishlistItem {
  productId: string;
  addedAt: number;
}

// Helper to load wishlist from localStorage
const loadWishlistFromStorage = (): WishlistItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(config.WISHLIST_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load wishlist from localStorage:', error);
    return [];
  }
};

// Helper to save wishlist to localStorage
const saveWishlistToStorage = (items: WishlistItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(config.WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save wishlist to localStorage:', error);
  }
};

export const useWishlist = () => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedItems = loadWishlistFromStorage();
    setItems(storedItems);
    setIsHydrated(true);
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      saveWishlistToStorage(items);
    }
  }, [items, isHydrated]);

  const addToWishlist = (product: Product) => {
    setItems((prevItems) => {
      const exists = prevItems.some((item) => item.productId === product.id);
      if (exists) return prevItems;
      return [...prevItems, { productId: product.id, addedAt: Date.now() }];
    });
  };

  const removeFromWishlist = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  const toggleWishlist = (product: Product) => {
    const isInWishlist = items.some((item) => item.productId === product.id);
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.productId === productId);
  };

  return {
    items,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    count: items.length,
  };
};
