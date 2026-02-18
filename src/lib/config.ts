// App Configuration Constants

export const config = {
  // Free shipping threshold in TL
  FREE_SHIPPING_THRESHOLD: 500,
  
  // Currency
  CURRENCY: 'TL',
  CURRENCY_SYMBOL: '₺',
  
  // Store info
  STORE_NAME: 'Fitnlitt',
  
  // Cart
  CART_STORAGE_KEY: 'fitnlitt_cart',
  WISHLIST_STORAGE_KEY: 'fitnlitt_wishlist',
  
  // Product limits
  MAX_CART_QUANTITY: 10,
} as const;

export type Config = typeof config;
