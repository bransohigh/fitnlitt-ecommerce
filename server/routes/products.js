/**
 * Products API Routes
 * GET /api/products - List products with filters
 * GET /api/products/:slug - Get product by slug
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { parseProductFilters, parseSortParam } = require('../lib/parse');
const { buildProductQuery } = require('../lib/filters');
const { computeFacets } = require('../lib/facets');
const { ok, notFound, serverError, badRequest, paginatedResponse } = require('../lib/response');

/**
 * Helper: Get variants summary for a product
 */
async function getVariantsSummary(productId) {
  const { data, error } = await supabase
    .from('variants')
    .select('size, color, price_override, stock')
    .eq('product_id', productId);

  if (error) {
    console.error('Error fetching variants summary:', error);
    return null;
  }

  const sizes = [...new Set(data.map(v => v.size))];
  const colors = [...new Set(data.map(v => v.color))];
  const prices = data.map(v => v.price_override).filter(p => p !== null);
  const totalStock = data.reduce((sum, v) => sum + (v.stock || 0), 0);

  return {
    sizes,
    colors,
    minPrice: prices.length > 0 ? Math.min(...prices) : null,
    maxPrice: prices.length > 0 ? Math.max(...prices) : null,
    inStock: totalStock > 0,
    totalStock,
  };
}

/**
 * Helper: Get primary image for a product
 */
async function getPrimaryImage(productId) {
  const { data, error } = await supabase
    .from('product_images')
    .select('url')
    .eq('product_id', productId)
    .order('sort', { ascending: true })
    .limit(1)
    .single();

  if (error || !data) return null;
  return { url: data.url };
}

/**
 * Helper: Get all images for a product
 */
async function getAllImages(productId) {
  const { data, error } = await supabase
    .from('product_images')
    .select('url, sort')
    .eq('product_id', productId)
    .order('sort', { ascending: true });

  if (error) return [];
  return data;
}

/**
 * Helper: Calculate product badges
 */
function calculateBadges(product, variantsSummary) {
  const now = new Date();
  const createdAt = new Date(product.created_at);
  const daysDiff = (now - createdAt) / (1000 * 60 * 60 * 24);

  return {
    isNew: daysDiff <= 21,
    isSale: product.compare_at && product.compare_at > product.price,
    isLowStock: variantsSummary && variantsSummary.totalStock <= 3,
    isFeatured: product.is_featured,
  };
}

/**
 * Helper: Format product for listing
 */
async function formatProductForListing(product, includes) {
  const variantsSummary = await getVariantsSummary(product.id);
  const primaryImage = await getPrimaryImage(product.id);

  const formatted = {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: parseFloat(product.price),
    compare_at: product.compare_at ? parseFloat(product.compare_at) : null,
    currency: product.currency,
    primaryImage,
    variantsSummary,
    badges: calculateBadges(product, variantsSummary),
  };

  if (includes.has('collection') && product.collections) {
    formatted.collection = {
      slug: product.collections.slug,
      title: product.collections.title,
    };
  }

  if (includes.has('images')) {
    formatted.images = await getAllImages(product.id);
  }

  return formatted;
}

/**
 * GET /api/products
 * List products with filtering, sorting, and pagination
 */
router.get('/', async (req, res) => {
  try {
    // Parse filters
    const filters = parseProductFilters(req.query);
    const { orderBy } = parseSortParam(filters.sort);

    // Build query with filters
    const { query: baseQuery, isEmpty } = await buildProductQuery(filters);

    // If no products match filters, return empty result early
    if (isEmpty) {
      return ok(res, paginatedResponse([], 0, filters.page, filters.limit, {}));
    }

    // Apply sorting
    let query = baseQuery;
    orderBy.forEach(order => {
      query = query.order(order.field, { ascending: order.order === 'asc' });
    });

    // Apply pagination
    const offset = (filters.page - 1) * filters.limit;
    query = query.range(offset, offset + filters.limit - 1);

    // Execute query
    const { data: products, error, count } = await query;

    if (error) throw error;

    // Format products
    const formattedProducts = await Promise.all(
      products.map(p => formatProductForListing(p, filters.include))
    );

    // Compute facets (based on filtered result set)
    const productIds = products.map(p => p.id);
    const includeCollectionFacets = !filters.collection; // Don't show collection facets if already filtered
    const facets = await computeFacets(productIds, includeCollectionFacets);

    // Return paginated response
    ok(res, paginatedResponse(formattedProducts, count, filters.page, filters.limit, facets));
  } catch (error) {
    serverError(res, 'Failed to fetch products', error);
  }
});

/**
 * GET /api/products/:slug
 * Get product details by slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    // Fetch product with collection
    const { data: product, error } = await supabase
      .from('products')
      .select('*, collections!inner(slug, title, description, hero_image)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound(res, `Product '${slug}' not found`);
      }
      throw error;
    }

    // Fetch images
    const images = await getAllImages(product.id);

    // Fetch variants
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select('id, size, color, sku, price_override, stock')
      .eq('product_id', product.id)
      .order('size', { ascending: true })
      .order('color', { ascending: true });

    if (variantsError) throw variantsError;

    // Format variants
    const formattedVariants = variants.map(v => ({
      id: v.id,
      size: v.size,
      color: v.color,
      sku: v.sku,
      price: v.price_override ? parseFloat(v.price_override) : parseFloat(product.price),
      stock: v.stock,
      isInStock: v.stock > 0,
    }));

    // Calculate total stock
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);

    // Format response
    const response = {
      product: {
        id: product.id,
        slug: product.slug,
        title: product.title,
        description: product.description,
        price: parseFloat(product.price),
        compare_at: product.compare_at ? parseFloat(product.compare_at) : null,
        currency: product.currency,
        collection: {
          slug: product.collections.slug,
          title: product.collections.title,
          description: product.collections.description,
          hero_image: product.collections.hero_image,
        },
        images,
        variants: formattedVariants,
        badges: {
          isNew: (new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24) <= 21,
          isSale: product.compare_at && product.compare_at > product.price,
          isLowStock: totalStock <= 3,
          isFeatured: product.is_featured,
        },
      },
    };

    ok(res, response);
  } catch (error) {
    serverError(res, 'Failed to fetch product', error);
  }
});

module.exports = router;
