/**
 * Facet computation utilities
 * Generates filter options with counts for UI
 */

const { supabase } = require('./supabase');

/**
 * Compute size facets from variants
 * @param {Array} productIds - Array of product UUIDs (filtered)
 * @returns {Array} - Array of {value, count}
 */
async function computeSizeFacets(productIds = null) {
  let query = supabase
    .from('variants')
    .select('size');

  if (productIds && productIds.length > 0) {
    query = query.in('product_id', productIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error computing size facets:', error);
    return [];
  }

  // Count occurrences
  const counts = {};
  data.forEach(v => {
    counts[v.size] = (counts[v.size] || 0) + 1;
  });

  // Convert to array and sort by standard size order
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => {
      const aIndex = sizeOrder.indexOf(a.value);
      const bIndex = sizeOrder.indexOf(b.value);
      if (aIndex === -1 && bIndex === -1) return a.value.localeCompare(b.value);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
}

/**
 * Compute color facets from variants
 * @param {Array} productIds - Array of product UUIDs (filtered)
 * @returns {Array} - Array of {value, count}
 */
async function computeColorFacets(productIds = null) {
  let query = supabase
    .from('variants')
    .select('color');

  if (productIds && productIds.length > 0) {
    query = query.in('product_id', productIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error computing color facets:', error);
    return [];
  }

  // Count occurrences
  const counts = {};
  data.forEach(v => {
    counts[v.color] = (counts[v.color] || 0) + 1;
  });

  // Convert to array and sort by count (descending)
  return Object.entries(counts)
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Compute price range from products
 * @param {Array} productIds - Array of product UUIDs (filtered)
 * @returns {Object} - {min, max}
 */
async function computePriceRange(productIds = null) {
  let query = supabase
    .from('products')
    .select('price')
    .eq('is_active', true);

  if (productIds && productIds.length > 0) {
    query = query.in('id', productIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error computing price range:', error);
    return { min: 0, max: 0 };
  }

  if (data.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = data.map(p => parseFloat(p.price));
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

/**
 * Compute collection facets
 * @param {Array} productIds - Array of product UUIDs (filtered)
 * @returns {Array} - Array of {slug, title, count}
 */
async function computeCollectionFacets(productIds = null) {
  // First, get collection_ids from products
  let query = supabase
    .from('products')
    .select('collection_id')
    .eq('is_active', true)
    .not('collection_id', 'is', null);

  if (productIds && productIds.length > 0) {
    query = query.in('id', productIds);
  }

  const { data: products, error: productsError } = await query;

  if (productsError) {
    console.error('Error fetching products for collection facets:', productsError);
    return [];
  }

  if (!products || products.length === 0) {
    return [];
  }

  // Count collection_id occurrences
  const collectionIdCounts = {};
  products.forEach(p => {
    if (p.collection_id) {
      collectionIdCounts[p.collection_id] = (collectionIdCounts[p.collection_id] || 0) + 1;
    }
  });

  const uniqueCollectionIds = Object.keys(collectionIdCounts);

  // Fetch collection details
  const { data: collections, error: collectionsError } = await supabase
    .from('collections')
    .select('id, slug, title')
    .in('id', uniqueCollectionIds);

  if (collectionsError) {
    console.error('Error fetching collections:', collectionsError);
    return [];
  }

  // Build result with counts
  const countMap = {};
  collections.forEach(collection => {
    const key = collection.slug;
    if (!countMap[key]) {
      countMap[key] = {
        slug: collection.slug,
        title: collection.title,
        count: collectionIdCounts[collection.id] || 0,
      };
    }
  });

  // Convert to array and sort by count (descending)
  return Object.values(countMap).sort((a, b) => b.count - a.count);
}

/**
 * Compute all facets in parallel
 * @param {Array} productIds - Array of product UUIDs (filtered)
 * @param {boolean} includeCollections - Whether to include collection facets
 * @returns {Object} - {sizes, colors, price, collections}
 */
async function computeFacets(productIds = null, includeCollections = true) {
  const [sizes, colors, price, collections] = await Promise.all([
    computeSizeFacets(productIds),
    computeColorFacets(productIds),
    computePriceRange(productIds),
    includeCollections ? computeCollectionFacets(productIds) : Promise.resolve(null),
  ]);

  const facets = {
    sizes,
    colors,
    price,
  };

  if (includeCollections && collections) {
    facets.collections = collections;
  }

  return facets;
}

module.exports = {
  computeSizeFacets,
  computeColorFacets,
  computePriceRange,
  computeCollectionFacets,
  computeFacets,
};
