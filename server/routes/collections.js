/**
 * Collections API Routes
 * GET /api/collections - List all collections
 * GET /api/collections/:slug - Get collection by slug
 */

const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { ok, notFound, serverError } = require('../lib/response');

/**
 * GET /api/collections
 * List all collections
 */
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('collections')
      .select('id, slug, title, description, hero_image, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    ok(res, {
      collections: data,
      meta: {
        total: data.length,
      },
    });
  } catch (error) {
    serverError(res, 'Failed to fetch collections', error);
  }
});

/**
 * GET /api/collections/:slug
 * Get collection details by slug
 */
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const { data, error } = await supabase
      .from('collections')
      .select('id, slug, title, description, hero_image, created_at')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return notFound(res, `Collection '${slug}' not found`);
      }
      throw error;
    }

    ok(res, { collection: data });
  } catch (error) {
    serverError(res, 'Failed to fetch collection', error);
  }
});

module.exports = router;
