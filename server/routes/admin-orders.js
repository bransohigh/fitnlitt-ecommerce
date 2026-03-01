const express = require('express');
const router = express.Router();
const { createServiceClient } = require('../lib/supabase');
const { ok, notFound, serverError, badRequest } = require('../lib/response');

// GET /api/admin/orders — list with pagination, filter, search
router.get('/', async (req, res) => {
  try {
    const supabase = createServiceClient();
    const { status, search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%,customer_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return ok(res, { orders: data, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('[admin/orders] list error:', err);
    return serverError(res, 'Siparişler alınamadı.');
  }
});

// GET /api/admin/orders/:id — single order
router.get('/:id', async (req, res) => {
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) return notFound(res, 'Sipariş bulunamadı.');
    return ok(res, data);
  } catch (err) {
    console.error('[admin/orders] get error:', err);
    return serverError(res, 'Sipariş alınamadı.');
  }
});

// PATCH /api/admin/orders/:id — update status and/or tracking
router.patch('/:id', async (req, res) => {
  try {
    const supabase = createServiceClient();
    const { status, tracking_number, notes } = req.body;
    const allowed = ['Beklemede', 'İşleniyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi', 'İade'];

    if (status && !allowed.includes(status)) {
      return badRequest(res, 'Geçersiz sipariş durumu.');
    }

    const updates = { updated_at: new Date().toISOString() };
    if (status) updates.status = status;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;
    if (notes !== undefined) updates.notes = notes;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) return notFound(res, 'Sipariş bulunamadı.');
    return ok(res, data);
  } catch (err) {
    console.error('[admin/orders] update error:', err);
    return serverError(res, 'Sipariş güncellenemedi.');
  }
});

module.exports = router;
