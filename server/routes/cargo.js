const express = require('express');
const router = express.Router();
const { supabaseAdmin } = require('../lib/supabase');
const { ok, notFound, serverError } = require('../lib/response');

// GET /api/cargo/:query  — query can be order_number (FNL-2026-0001) or tracking_number (YK987654321TR)
router.get('/:query', async (req, res) => {
  const query = (req.params.query || '').trim().toUpperCase();

  if (!query || query.length < 3) {
    return res.status(400).json({ error: 'Geçerli bir sipariş veya takip numarası giriniz.' });
  }

  try {
    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .or(`order_number.eq.${query},tracking_number.eq.${query}`)
      .limit(1);

    if (error || !orders || orders.length === 0) {
      return notFound(res, 'Bu numaraya ait sipariş veya kargo bulunamadı.');
    }

    const order = orders[0];

    // Map order status → cargo step
    const statusMap = {
      'Beklemede':       'Hazırlanıyor',
      'İşleniyor':       'Hazırlanıyor',
      'Kargoya Verildi': 'Kargoya Verildi',
      'Dağıtımda':       'Dağıtımda',
      'Teslim Edildi':   'Teslim Edildi',
      'İptal Edildi':    'İptal Edildi',
      'İade':            'İade',
    };
    const cargoStatus = statusMap[order.status] || 'Hazırlanıyor';

    // Infer carrier from tracking number prefix
    let carrier = 'Yurtiçi Kargo';
    if (order.tracking_number) {
      if (order.tracking_number.startsWith('MNG')) carrier = 'MNG Kargo';
      else if (order.tracking_number.startsWith('PTT')) carrier = 'PTT Kargo';
      else if (order.tracking_number.startsWith('ARS')) carrier = 'Aras Kargo';
    }

    const events = buildEvents(order, cargoStatus);

    const shipment = {
      id: order.id,
      tracking_number: order.tracking_number || order.order_number,
      order_id: order.id,
      order_number: order.order_number,
      status: cargoStatus,
      carrier,
      customer_name: order.customer_name,
      estimated_delivery:
        cargoStatus === 'Kargoya Verildi'
          ? estimatedDelivery(order.updated_at || order.created_at)
          : null,
      events,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };

    return ok(res, shipment);
  } catch (err) {
    console.error('[cargo] error:', err);
    return serverError(res, 'Kargo bilgisi alınamadı.');
  }
});

function buildEvents(order, cargoStatus) {
  const events = [];
  const createdAt = new Date(order.created_at);

  events.push({
    date: formatDate(createdAt),
    description: 'Siparişiniz alındı.',
    location: 'Fitnlitt Depo',
  });

  if (['Hazırlanıyor'].includes(cargoStatus) && order.status === 'İşleniyor') {
    const processing = new Date(createdAt.getTime() + 1 * 60 * 60 * 1000);
    events.push({
      date: formatDate(processing),
      description: 'Siparişiniz hazırlanıyor.',
      location: 'Fitnlitt Depo',
    });
  }

  if (['Kargoya Verildi', 'Dağıtımda', 'Teslim Edildi'].includes(cargoStatus)) {
    const shipped = new Date(createdAt.getTime() + 2 * 24 * 60 * 60 * 1000);
    events.push({
      date: formatDate(shipped),
      description: 'Kargo şubesine teslim edildi.',
      location: 'Transfer Merkezi',
    });
  }

  if (['Dağıtımda', 'Teslim Edildi'].includes(cargoStatus)) {
    const onRoute = new Date(createdAt.getTime() + 3 * 24 * 60 * 60 * 1000);
    events.push({
      date: formatDate(onRoute),
      description: 'Dağıtıma çıktı.',
      location: order.shipping_address?.city || 'Teslimat Şehri',
    });
  }

  if (cargoStatus === 'Teslim Edildi') {
    const delivered = new Date(createdAt.getTime() + 4 * 24 * 60 * 60 * 1000);
    events.push({
      date: formatDate(delivered),
      description: 'Teslim edildi.',
      location: order.shipping_address?.city || 'Teslimat Adresi',
    });
  }

  return events.reverse(); // newest first
}

function formatDate(date) {
  return date.toLocaleString('tr-TR', {
    day:    '2-digit',
    month:  'long',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

function estimatedDelivery(shippedAt) {
  const d = new Date(shippedAt);
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

module.exports = router;
