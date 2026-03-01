import { useState, useEffect, useCallback } from 'react';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Users, Search, RefreshCw } from 'lucide-react';

interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  total_spent: number;
  order_count: number;
  created_at: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatPrice(n: number) {
  return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n);
}

export function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: '1', limit: '50' });
      if (search.trim()) params.set('search', search.trim());
      const res = await fetch(`/api/admin/customers?${params}`);
      const json = await res.json();
      setCustomers(json.data?.customers ?? json.customers ?? []);
      setTotal(json.data?.total ?? json.total ?? 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  return (
    <AdminShell>
      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Müşteriler</h1>
          <p className="text-gray-500 text-sm">Toplam {total} müşteri</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchCustomers} className="gap-2">
          <RefreshCw className="w-4 h-4" /> Yenile
        </Button>
      </div>

      <div className="relative max-w-sm mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Email veya isim ara…" className="pl-9" />
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-gray-400">Yükleniyor…</div>
          ) : customers.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">Müşteri bulunamadı</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Müşteri</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Telefon</th>
                  <th className="text-center px-5 py-3 font-semibold text-gray-600">Sipariş</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600">Toplam Harcama</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Kayıt Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-800">{c.first_name} {c.last_name}</p>
                      <p className="text-xs text-gray-400">{c.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">{c.phone ?? '—'}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-700 font-semibold text-xs">{c.order_count}</span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-semibold text-gray-800">{formatPrice(c.total_spent)}</td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(c.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </AdminShell>
  );
}
