const express = require('express');
const router = express.Router();
const { supabase } = require('../lib/supabase');
const { ok, notFound, serverError } = require('../lib/response');

// GET /api/cargo/:trackingNumber
router.get('/:trackingNumber', async (req, res) => {
  const { trackingNumber } = req.params;

  if (!trackingNumber || trackingNumber.trim().length < 3) {
    return res.status(400).json({ error: 'Geçerli bir takip numarası giriniz.' });
  }

  try {
    const { data, error } = await supabase
      .from('shipments')
      .select('*')
      .eq('tracking_number', trackingNumber.trim().toUpperCase())
      .single();

    if (error || !data) {
      return notFound(res, 'Bu takip numarasına ait kargo bulunamadı.');
    }

    return ok(res, data);
  } catch (err) {
    console.error('[cargo] error:', err);
    return serverError(res, 'Kargo bilgisi alınamadı.');
  }
});

module.exports = router;
