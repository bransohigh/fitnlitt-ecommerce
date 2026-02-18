/**
 * Query filter builders for Supabase
 * Handles complex filtering logic for products
 */

const { supabase } = require('./supabase');

/**
 * Apply collection filter to query
 * @param {Object} query - Supabase query builder
 * @param {Object} filters - Parsed filters
 * @returns {Object} - Modified query
 */
function applyCollectionFilter(query, filters) {
  if (filters.collection) {
    // Single collection by slug
    query = query.eq('collections.slug', filters.collection);
  } else if (filters.collections.length > 0) {
    // Multiple collections by slug
    query = query.in('collections.slug', filters.collections);
  }
  return query;
}

/**
 * Apply text search filter
 * @param {Object} query - Supabase query builder
 * @param {string} searchText - Search query
 * @returns {Object} - Modified query
 */
function applySearchFilter(query, searchText) {
  if (searchText) {
    query = query.ilike('title', `%${searchText}%`);
  }
  return query;
}

/**
 * Apply price range filter
 * @param {Object} query - Supabase query builder
 * @param {number} priceMin - Minimum price
 * @param {number} priceMax - Maximum price
 * @returns {Object} - Modified query
 */
function applyPriceFilter(query, priceMin, priceMax) {
  if (priceMin !== null && priceMin >= 0) {
    query = query.gte('price', priceMin);
  }
  if (priceMax !== null && priceMax > 0 && (priceMin === null || priceMax >= priceMin)) {
    query = query.lte('price', priceMax);
  }
  return query;
}

/**
 * Apply sale filter
 * @param {Object} query - Supabase query builder
 * @param {boolean} onSale - Filter for on-sale products
 * @returns {Object} - Modified query
 */
function applySaleFilter(query, onSale) {
  if (onSale === true) {
    query = query.not('compare_at', 'is', null).gt('compare_at', 'price');
  }
  return query;
}

/**
 * Apply featured filter
 * @param {Object} query - Supabase query builder
 * @param {boolean} featured - Filter for featured products
 * @returns {Object} - Modified query
 */
function applyFeaturedFilter(query, featured) {
  if (featured === true) {
    query = query.eq('is_featured', true);
  }
  return query;
}

/**
 * Get product IDs that match variant filters (size, color, stock)
 * Uses an efficient subquery approach to avoid row duplication
 * @param {Object} filters - Parsed filters
 * @returns {Array} - Array of product UUIDs
 */
async function getProductIdsByVariants(filters) {
  const { sizes, colors, inStock } = filters;
  
  // If no variant filters, return null (no filtering needed)
  if (sizes.length === 0 && colors.length === 0 && inStock === null) {
    return null;
  }

  let query = supabase
    .from('variants')
    .select('product_id');

  // Apply size filter
  if (sizes.length > 0) {
    query = query.in('size', sizes);
  }

  // Apply color filter
  if (colors.length > 0) {
    query = query.in('color', colors);
  }

  // Apply stock filter
  if (inStock === true) {
    query = query.gt('stock', 0);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching variant product IDs:', error);
    throw error;
  }

  // Extract unique product IDs
  const productIds = [...new Set(data.map(v => v.product_id))];
  return productIds.length > 0 ? productIds : [];
}

/**
 * Build complete product query with all filters
 * @param {Object} filters - Parsed filters
 * @returns {Object} - Supabase query builder
 */
async function buildProductQuery(filters) {
  // Start with base query
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true);

  // Handle collection filter by fetching collection IDs first
  if (filters.collection || filters.collections.length > 0) {
    const collectionSlugs = filters.collection 
      ? [filters.collection] 
      : filters.collections;
    
    const { data: collections } = await supabase
      .from('collections')
      .select('id')
      .in('slug', collectionSlugs);
    
    if (!collections || collections.length === 0) {
      return { query: null, isEmpty: true };
    }
    
    const collectionIds = collections.map(c => c.id);
    query = query.in('collection_id', collectionIds);
  }

  // Apply variant filters first (this may limit product IDs)
  const variantProductIds = await getProductIdsByVariants(filters);
  if (variantProductIds !== null) {
    if (variantProductIds.length === 0) {
      // No products match variant filters - return empty result
      return { query: null, isEmpty: true };
    }
    query = query.in('id', variantProductIds);
  }

  // Apply search filter
  query = applySearchFilter(query, filters.q);

  // Apply price filter
  query = applyPriceFilter(query, filters.priceMin, filters.priceMax);

  // Apply sale filter
  query = applySaleFilter(query, filters.onSale);

  // Apply featured filter
  query = applyFeaturedFilter(query, filters.featured);

  return { query, isEmpty: false };
}

module.exports = {
  applyCollectionFilter,
  applySearchFilter,
  applyPriceFilter,
  applySaleFilter,
  applyFeaturedFilter,
  getProductIdsByVariants,
  buildProductQuery,
};
