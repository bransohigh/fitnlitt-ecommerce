/**
 * Admin Upload API Routes
 * Protected endpoints for uploading images to Supabase Storage
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createServiceClient } = require('../lib/supabase');
const { requireAuth } = require('../middleware/auth');
const { successResponse, errorResponse } = require('../lib/response');

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'));
      return;
    }
    cb(null, true);
  },
});

// All routes require authentication
router.use(requireAuth);

/**
 * POST /api/admin/upload
 * Upload a single image to Supabase Storage
 */
router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(errorResponse('No file provided'));
    }

    const supabase = createServiceClient();
    const file = req.file;
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `products/${fileName}`;

    // Upload to Supabase Storage
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return res.json(
      successResponse({
        url: publicUrl,
        path: filePath,
        filename: fileName,
      }, 'Image uploaded successfully')
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json(errorResponse(error.message || 'Failed to upload image'));
  }
});

/**
 * POST /api/admin/upload/multiple
 * Upload multiple images to Supabase Storage
 */
router.post('/multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json(errorResponse('No files provided'));
    }

    const supabase = createServiceClient();
    const uploadedFiles = [];
    const errors = [];

    // Upload each file
    for (const file of req.files) {
      try {
        const timestamp = Date.now();
        const fileName = `${timestamp}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const filePath = `products/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedFiles.push({
          url: publicUrl,
          path: filePath,
          filename: fileName,
        });
      } catch (error) {
        errors.push({
          filename: file.originalname,
          error: error.message,
        });
      }
    }

    if (uploadedFiles.length === 0) {
      return res.status(500).json(errorResponse('All uploads failed', { errors }));
    }

    return res.json(
      successResponse({
        uploaded: uploadedFiles,
        errors,
      }, `${uploadedFiles.length} of ${req.files.length} images uploaded successfully`)
    );
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json(errorResponse('Failed to upload images'));
  }
});

/**
 * DELETE /api/admin/upload
 * Delete an image from Supabase Storage
 */
router.delete('/', async (req, res) => {
  try {
    const { path } = req.body;

    if (!path) {
      return res.status(400).json(errorResponse('File path is required'));
    }

    const supabase = createServiceClient();

    const { error } = await supabase.storage
      .from('product-images')
      .remove([path]);

    if (error) throw error;

    return res.json(successResponse(null, 'Image deleted successfully'));
  } catch (error) {
    console.error('Error deleting image:', error);
    return res.status(500).json(errorResponse('Failed to delete image'));
  }
});

module.exports = router;
