/**
 * Admin Products API Routes
 * Protected endpoints for creating, updating, and deleting products
 */

const express = require('express');
const router = express.Router();
const { createServiceClient } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../lib/response');

// All routes require authentication
router.use(requireAuth);

/**
 * GET /api/admin/products/:id
 * Get a single product by ID for editing
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createServiceClient();

    // Fetch product with all related data
    const { data: product, error: productError } = await supabase
      .from('products')
      .select(`
        *,
        collection:collections(id, name, slug),
        images:product_images(id, url, alt_text, display_order),
        variants(id, color, size, sku, price, compare_at_price, stock_quantity)
      `)
      .eq('id', id)
      .single();

    if (productError) throw productError;
    if (!product) {
      return res.status(404).json(errorResponse('Product not found'));
    }

    return res.json(successResponse(product));
  } catch (error) {
    console.error('Error fetching product:', error);
    return res.status(500).json(errorResponse('Failed to fetch product'));
  }
});

/**
 * POST /api/admin/products
 * Create a new product with variants and images
 */
router.post('/', async (req, res) => {
  try {
    const supabase = createServiceClient();
    const {
      name,
      slug,
      description,
      collection_id,
      is_featured,
      variants,
      images,
      facets,
    } = req.body;

    // Validate required fields
    if (!name || !slug) {
      return res.status(400).json(errorResponse('Name and slug are required'));
    }

    // Check if slug already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existing) {
      return res.status(400).json(errorResponse('Product with this slug already exists'));
    }

    // Insert product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description,
        collection_id: collection_id || null,
        is_featured: is_featured || false,
      })
      .select()
      .single();

    if (productError) throw productError;

    // Insert variants if provided
    if (variants && variants.length > 0) {
      const variantsToInsert = variants.map((v) => ({
        product_id: product.id,
        color: v.color,
        size: v.size,
        sku: v.sku,
        price: v.price,
        compare_at_price: v.compare_at_price || null,
        stock_quantity: v.stock_quantity || 0,
      }));

      const { error: variantsError } = await supabase
        .from('variants')
        .insert(variantsToInsert);

      if (variantsError) throw variantsError;
    }

    // Insert images if provided
    if (images && images.length > 0) {
      const imagesToInsert = images.map((img, index) => ({
        product_id: product.id,
        url: img.url,
        alt_text: img.alt_text || name,
        display_order: img.display_order ?? index,
      }));

      const { error: imagesError } = await supabase
        .from('product_images')
        .insert(imagesToInsert);

      if (imagesError) throw imagesError;
    }

    // Insert facets if provided
    if (facets && facets.length > 0) {
      const facetsToInsert = facets.map((f) => ({
        product_id: product.id,
        facet_name: f.facet_name,
        facet_value: f.facet_value,
      }));

      const { error: facetsError } = await supabase
        .from('product_facets')
        .insert(facetsToInsert);

      if (facetsError) throw facetsError;
    }

    return res.status(201).json(successResponse(product, 'Product created successfully'));
  } catch (error) {
    console.error('Error creating product:', error);
    return res.status(500).json(errorResponse('Failed to create product'));
  }
});

/**
 * PUT /api/admin/products/:id
 * Update an existing product
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createServiceClient();
    const {
      name,
      slug,
      description,
      collection_id,
      is_featured,
    } = req.body;

    // Update product
    const { data: product, error: productError } = await supabase
      .from('products')
      .update({
        name,
        slug,
        description,
        collection_id: collection_id || null,
        is_featured: is_featured || false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (productError) throw productError;
    if (!product) {
      return res.status(404).json(errorResponse('Product not found'));
    }

    return res.json(successResponse(product, 'Product updated successfully'));
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json(errorResponse('Failed to update product'));
  }
});

/**
 * DELETE /api/admin/products/:id
 * Delete a product (cascades to variants, images, facets)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = createServiceClient();

    // Delete product (cascades will handle related records)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.json(successResponse(null, 'Product deleted successfully'));
  } catch (error) {
    console.error('Error deleting product:', error);
    return res.status(500).json(errorResponse('Failed to delete product'));
  }
});

module.exports = router;
