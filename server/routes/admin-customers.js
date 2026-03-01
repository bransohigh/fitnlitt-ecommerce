const express = require('express');
const router = express.Router();
const { createServiceClient } = require('../lib/supabase');
const { ok, notFound, serverError } = require('../lib/response');

// GET /api/admin/customers
router.get('/', async (req, res) => {
  try {
    const supabase = createServiceClient();
    const { search, page = 1, limit = 20 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabase
      .from('customers')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (search) {
      query = query.or(`email.ilike.%${search}%,first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return ok(res, { customers: data, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error('[admin/customers] list error:', err);
    return serverError(res, 'Müşteriler alınamadı.');
  }
});

// GET /api/admin/customers/:id — with their orders
router.get('/:id', async (req, res) => {
  try {
    const supabase = createServiceClient();
    const [{ data: customer, error: cErr }, { data: orders, error: oErr }] = await Promise.all([
      supabase.from('customers').select('*').eq('id', req.params.id).single(),
      supabase.from('orders').select('*').eq('customer_id', req.params.id).order('created_at', { ascending: false }),
    ]);

    if (cErr || !customer) return notFound(res, 'Müşteri bulunamadı.');
    return ok(res, { ...customer, orders: orders || [] });
  } catch (err) {
    console.error('[admin/customers] get error:', err);
    return serverError(res, 'Müşteri alınamadı.');
  }
});

module.exports = router;
