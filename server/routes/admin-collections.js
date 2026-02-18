/**
 * Admin Collections API Routes
 * Protected endpoints for managing collections
 */

const express = require('express');
const router = express.Router();
const { createServiceClient } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../lib/response');

// All routes require authentication
router.use(requireAuth);

/**
 * GET /api/admin/collections
 * Get all collections for management
 */
router.get('/', async (req, res) => {
  try {
    const supabase = createServiceClient();

    const { data: collections, error } = await supabase
      .from('collections')
      .select('*, product_count:products(count)')
      .order('name');

    if (error) throw error;

    // Transform the count data
    const collectionsWithCount = collections.map((col) => ({
      ...col,
      product_count: col.product_count?.[0]?.count || 0,
    }));

    return res.json(successResponse(collectionsWithCount));
  } catch (error) {
    console.error('Error fetching collections:', error);
    return res.status(500).json(errorResponse('Failed to fetch collections'));
  }
});

/**
 * GET /api/admin/collections/:id
 * Get a single collection by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createServiceClient();

    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!collection) {
      return res.status(404).json(errorResponse('Collection not found'));
    }

    return res.json(successResponse(collection));
  } catch (error) {
    console.error('Error fetching collection:', error);
    return res.status(500).json(errorResponse('Failed to fetch collection'));
  }
});

/**
 * POST /api/admin/collections
 * Create a new collection
 */
router.post('/', async (req, res) => {
  try {
    const supabase = createServiceClient();
    const { name, slug, description } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json(errorResponse('Name and slug are required'));
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('collections')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return res.status(400).json(errorResponse('Collection with this slug already exists'));
    }

    // Insert collection
    const { data: collection, error } = await supabase
      .from('collections')
      .insert({ name, slug, description })
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json(successResponse(collection, 'Collection created successfully'));
  } catch (error) {
    console.error('Error creating collection:', error);
    return res.status(500).json(errorResponse('Failed to create collection'));
  }
});

/**
 * PUT /api/admin/collections/:id
 * Update an existing collection
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createServiceClient();
    const { name, slug, description } = req.body;

    // Update collection
    const { data: collection, error } = await supabase
      .from('collections')
      .update({
        name,
        slug,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!collection) {
      return res.status(404).json(errorResponse('Collection not found'));
    }

    return res.json(successResponse(collection, 'Collection updated successfully'));
  } catch (error) {
    console.error('Error updating collection:', error);
    return res.status(500).json(errorResponse('Failed to update collection'));
  }
});

/**
 * DELETE /api/admin/collections/:id
 * Delete a collection
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createServiceClient();

    // Check if collection has products
    const { data: products, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('collection_id', id)
      .limit(1);

    if (checkError) throw checkError;

    if (products && products.length > 0) {
      return res.status(400).json(
        errorResponse('Cannot delete collection with associated products')
      );
    }

    // Delete collection
    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.json(successResponse(null, 'Collection deleted successfully'));
  } catch (error) {
    console.error('Error deleting collection:', error);
    return res.status(500).json(errorResponse('Failed to delete collection'));
  }
});

module.exports = router;
