/**
 * Search API Routes
 * GET /api/search/suggest - Get search suggestions
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { ok, serverError, badRequest } = require('../lib/response');

/**
 * GET /api/search/suggest
 * Get search suggestions (autocomplete)
 * Query params:
 *   - q: search query (required)
 *   - limit: max results (default 8, max 20)
 */
router.get('/suggest', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return badRequest(res, 'Search query (q) is required');
    }

    const searchQuery = q.trim();
    const limit = Math.min(parseInt(req.query.limit) || 8, 20);

    // Search products by title
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        slug,
        title,
        price,
        currency,
        collections!inner(slug),
        product_images(url)
      `)
      .eq('is_active', true)
      .ilike('title', `%${searchQuery}%`)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Format suggestions
    const suggestions = products.map(p => ({
      slug: p.slug,
      title: p.title,
      price: parseFloat(p.price),
      currency: p.currency,
      primaryImageUrl: p.product_images && p.product_images.length > 0 
        ? p.product_images[0].url 
        : null,
      collectionSlug: p.collections ? p.collections.slug : null,
    }));

    ok(res, suggestions);
  } catch (error) {
    serverError(res, 'Failed to fetch search suggestions', error);
  }
});

/**
 * GET /api/search/top
 * Get top/featured products (shown on search focus before user types)
 */
router.get('/top', async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select(`
        slug,
        title,
        price,
        currency,
        collections!inner(slug),
        product_images(url)
      `)
      .eq('is_active', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(3);

    if (error) throw error;

    const results = (products || []).map(p => ({
      slug: p.slug,
      title: p.title,
      price: parseFloat(p.price),
      currency: p.currency,
      primaryImageUrl: p.product_images && p.product_images.length > 0
        ? p.product_images[0].url
        : null,
      collectionSlug: p.collections ? p.collections.slug : null,
    }));

    ok(res, results);
  } catch (error) {
    serverError(res, 'Failed to fetch top products', error);
  }
});

module.exports = router;
