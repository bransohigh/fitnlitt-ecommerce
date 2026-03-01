import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Search, RefreshCw, Eye, Package } from 'lucide-react';

interface OrderItem {
  product_id: string;
  title: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  order_number: string;
  customer_email: string;
  customer_name: string;
  status: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  shipping_address?: {
    name: string; address: string; city: string; district: string; zip: string; phone: string;
  };
  tracking_number?: string;
  notes?: string;
  created_at: string;
}

const STATUS_OPTIONS = ['all', 'Beklemede', 'İşleniyor', 'Kargoya Verildi', 'Teslim Edildi', 'İptal Edildi', 'İade'];

const STATUS_COLORS: Record<string, string> = {
  'Beklemede':       'bg-yellow-100 text-yellow-800 border-yellow-200',
  'İşleniyor':       'bg-blue-100 text-blue-800 border-blue-200',
  'Kargoya Verildi': 'bg-purple-100 text-purple-800 border-purple-200',
  'Teslim Edildi':   'bg-green-100 text-green-800 border-green-200',
  'İptal Edildi':    'bg-red-100 text-red-800 border-red-200',
  'İade':            'bg-gray-100 text-gray-800 border-gray-200',
};

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [trackingInput, setTrackingInput] = useState('');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: '1', limit: '50' });
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/admin/orders?${params}`);
      const json = await res.json();
      setOrders(json.data?.orders ?? json.orders ?? []);
      setTotal(json.data?.total ?? json.total ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openDetail = (order: Order) => {
    setSelected(order);
    setNewStatus(order.status);
    setTrackingInput(order.tracking_number ?? '');
  };

  const handleUpdate = async () => {
    if (!selected) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, tracking_number: trackingInput }),
      });
      const json = await res.json();
      const updated = json.data ?? json;
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
      setSelected(updated);
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Siparişler</h1>
          <p className="text-gray-500 text-sm">Toplam {total} sipariş</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOrders} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Yenile
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Sipariş no, müşteri..."
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors
                ${statusFilter === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
            >
              {s === 'all' ? 'Tümü' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-400">Yükleniyor…</div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Sipariş bulunamadı</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Sipariş No</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Müşteri</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Durum</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Ürünler</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Toplam</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Tarih</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-mono font-semibold text-gray-800">{order.order_number}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{order.items?.length ?? 0} ürün</td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800">{formatPrice(order.total)}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs whitespace-nowrap">{formatDate(order.created_at)}</td>
                    <td className="px-5 py-3.5">
                      <Button size="sm" variant="ghost" className="gap-1" onClick={() => openDetail(order)}>
                        <Eye className="w-3.5 h-3.5" /> Detay
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-mono text-lg">{selected.order_number}</DialogTitle>
              </DialogHeader>

              <div className="space-y-5 mt-2">
                {/* Status + Tracking update */}
                <Card className="border-dashed">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-700">Durum Güncelle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex gap-3">
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleUpdate} disabled={updatingStatus} className="bg-gray-900 hover:bg-gray-700 text-white">
                        {updatingStatus ? 'Kaydediliyor…' : 'Kaydet'}
                      </Button>
                    </div>
                    <Input
                      placeholder="Kargo takip numarası (opsiyonel)"
                      value={trackingInput}
                      onChange={e => setTrackingInput(e.target.value)}
                    />
                  </CardContent>
                </Card>

                {/* Customer info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Müşteri</p>
                    <p className="font-medium">{selected.customer_name}</p>
                    <p className="text-gray-500">{selected.customer_email}</p>
                  </div>
                  {selected.shipping_address && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Teslimat Adresi</p>
                      <p className="font-medium">{selected.shipping_address.address}</p>
                      <p className="text-gray-500">{selected.shipping_address.district}, {selected.shipping_address.city}</p>
                      <p className="text-gray-500">{selected.shipping_address.phone}</p>
                    </div>
                  )}
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider">Ürünler</p>
                  <div className="space-y-2">
                    {selected.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        {item.image && <img src={item.image} className="w-12 h-12 rounded object-cover shrink-0" />}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <p className="text-xs text-gray-400">{item.size} / {item.color} × {item.quantity}</p>
                        </div>
                        <p className="font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="border-t pt-4 space-y-1.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Ara Toplam</span><span>{formatPrice(selected.subtotal)}</span>
                  </div>
                  {selected.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>İndirim</span><span>-{formatPrice(selected.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-500">
                    <span>Kargo</span><span>{selected.shipping === 0 ? 'Ücretsiz' : formatPrice(selected.shipping)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
                    <span>Toplam</span><span>{formatPrice(selected.total)}</span>
                  </div>
                </div>

                {selected.tracking_number && (
                  <p className="text-sm text-gray-500">Takip No: <span className="font-mono font-semibold text-gray-800">{selected.tracking_number}</span></p>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
