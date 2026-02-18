/**
 * Facets API Routes
 * GET /api/facets - Get facets for filtered products
 */

const express = require('express');
const router = express.Router();
const { parseProductFilters } = require('../lib/parse');
const { buildProductQuery } = require('../lib/filters');
const { computeFacets } = require('../lib/facets');
const { ok, serverError } = require('../lib/response');

/**
 * GET /api/facets
 * Get facets (filter options) for products
 * Accepts same filter params as /api/products to compute facets for filtered set
 * Query params:
 *   - collection: collection slug
 *   - q: search query
 *   - (any other product filters)
 */
router.get('/', async (req, res) => {
  try {
    // Parse filters (excluding sort and pagination)
    const filters = parseProductFilters(req.query);

    // Build query with filters (no pagination)
    const { query, isEmpty } = await buildProductQuery(filters);

    // If no products match, return empty facets
    if (isEmpty) {
      return ok(res, {
        sizes: [],
        colors: [],
        price: { min: 0, max: 0 },
        collections: [],
      });
    }

    // Get product IDs from filtered query
    const { data: products, error } = await query.select('id');

    if (error) throw error;

    const productIds = products.map(p => p.id);
    
    // Compute facets
    const includeCollectionFacets = !filters.collection;
    const facets = await computeFacets(productIds, includeCollectionFacets);

    ok(res, facets);
  } catch (error) {
    serverError(res, 'Failed to compute facets', error);
  }
});

module.exports = router;
