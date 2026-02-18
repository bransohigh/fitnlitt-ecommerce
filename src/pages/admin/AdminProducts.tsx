/**
 * Admin Products Page
 * Table with search, add/edit modal, real delete
 */

import { useState, useEffect } from 'react';
import { supabaseAuth } from '@/lib/supabase-auth';
import { AdminShell } from '@/components/admin/AdminShell';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Eye, AlertCircle, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Product {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  price: number;
  compare_at: number | null;
  collection_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  collection_name?: string;
  updated_at: string;
}

interface CollectionOption {
  id: string;
  title: string;
  slug: string;
}

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  price: '',
  compare_at: '',
  collection_id: '',
  is_active: true,
  is_featured: false,
};
type FormState = typeof emptyForm;

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [collectionOptions, setCollectionOptions] = useState<CollectionOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchProducts();
    fetchCollectionOptions();
  }, []);

  async function fetchCollectionOptions() {
    const { data } = await supabaseAuth
      .from('collections')
      .select('id, title, slug')
      .order('title');
    setCollectionOptions(data ?? []);
  }

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data, error } = await supabaseAuth
        .from('products')
        .select(`
          id, slug, title, description, price, compare_at,
          is_active, is_featured, collection_id, created_at,
          collections(title)
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;

      setProducts(
        (data ?? []).map((p: any) => ({
          id: p.id,
          slug: p.slug,
          title: p.title,
          description: p.description ?? null,
          price: parseFloat(p.price),
          compare_at: p.compare_at ? parseFloat(p.compare_at) : null,
          is_active: p.is_active ?? true,
          is_featured: p.is_featured ?? false,
          collection_id: p.collection_id ?? null,
          collection_name: p.collections?.title ?? null,
          updated_at: p.created_at ?? new Date().toISOString(),
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditingProduct(product);
    setForm({
      title: product.title,
      slug: product.slug,
      description: product.description ?? '',
      price: product.price.toString(),
      compare_at: product.compare_at?.toString() ?? '',
      collection_id: product.collection_id ?? '',
      is_active: product.is_active,
      is_featured: product.is_featured,
    });
    setFormError('');
    setModalOpen(true);
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: editingProduct ? f.slug : slugify(title),
    }));
  }

  async function handleSave() {
    setFormError('');
    if (!form.title.trim()) { setFormError('Ürün adı zorunlu.'); return; }
    if (!form.slug.trim()) { setFormError('Slug zorunlu.'); return; }
    if (!form.price || isNaN(parseFloat(form.price))) { setFormError('Geçerli bir fiyat girin.'); return; }

    setSaving(true);
    try {
      const payload: any = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        compare_at: form.compare_at ? parseFloat(form.compare_at) : null,
        collection_id: form.collection_id || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
      };

      if (editingProduct) {
        const { error } = await supabaseAuth.from('products').update(payload).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseAuth.from('products').insert(payload);
        if (error) throw error;
      }

      setModalOpen(false);
      await fetchProducts();
    } catch (err: any) {
      setFormError(err.message || 'Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`"${product.title}" ürününü silmek istediğinize emin misiniz?`)) return;
    const { error } = await supabaseAuth.from('products').delete().eq('id', product.id);
    if (error) { alert(error.message); return; }
    await fetchProducts();
  }

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button onClick={openAdd} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Ürün Ekle
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="mb-6 p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Ürün ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Products Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Ürün</TableHead>
              <TableHead className="font-semibold">Slug</TableHead>
              <TableHead className="font-semibold">Koleksiyon</TableHead>
              <TableHead className="font-semibold">Fiyat</TableHead>
              <TableHead className="font-semibold">Durum</TableHead>
              <TableHead className="font-semibold text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeletons
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredProducts.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">Henüz ürün yok</p>
                    <Button onClick={openAdd}>
                      <Plus className="w-4 h-4 mr-2" />
                      İlk Ürünü Ekle
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Product rows
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell className="text-sm text-gray-600 font-mono">{product.slug}</TableCell>
                  <TableCell>
                    {product.collection_name ? (
                      <Badge variant="secondary">{product.collection_name}</Badge>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatPrice(product.price)}₺
                    {product.compare_at && (
                      <span className="text-xs text-gray-400 line-through ml-2">
                        {formatPrice(product.compare_at)}₺
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}>
                        {product.is_active ? 'Aktif' : 'Pasif'}
                      </Badge>
                      {product.is_featured && (
                        <Badge className="bg-blue-100 text-blue-700">Öne Çıkan</Badge>
                      )}
                      {product.compare_at && (
                        <Badge className="bg-orange-100 text-orange-700">İndirimli</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Ön izle"
                        onClick={() => window.open(`/product/${product.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Düzenle"
                        onClick={() => openEdit(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Sil"
                        onClick={() => handleDelete(product)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {!loading && filteredProducts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredProducts.length} / {products.length} ürün gösteriliyor
            </p>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div>
              <Label htmlFor="p-title">Ürün Adı *</Label>
              <Input
                id="p-title"
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Örn: Siyah Spor Tayt"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="p-slug">Slug *</Label>
              <Input
                id="p-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="siyah-spor-tayt"
                className="mt-1 font-mono text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">URL'de kullanılır. Küçük harf, tire ile.</p>
            </div>

            <div>
              <Label htmlFor="p-desc">Açıklama</Label>
              <Textarea
                id="p-desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Ürün açıklaması..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="p-price">Fiyat (₺) *</Label>
                <Input
                  id="p-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="299.90"
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="p-compare">İndirim Öncesi Fiyat (₺)</Label>
                <Input
                  id="p-compare"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compare_at}
                  onChange={(e) => setForm((f) => ({ ...f, compare_at: e.target.value }))}
                  placeholder="399.90"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-collection">Koleksiyon</Label>
              <Select
                value={form.collection_id || 'none'}
                onValueChange={(v) => setForm((f) => ({ ...f, collection_id: v === 'none' ? '' : v }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Koleksiyon seç..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">— Koleksiyon yok —</SelectItem>
                  {collectionOptions.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium text-sm">Aktif</p>
                <p className="text-xs text-gray-500">Müşteriler bu ürünü görebilir</p>
              </div>
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
              />
            </div>

            <div className="flex items-center justify-between border rounded-lg p-3">
              <div>
                <p className="font-medium text-sm">Öne Çıkan</p>
                <p className="text-xs text-gray-500">Ana sayfada ve öne çıkanlarda göster</p>
              </div>
              <Switch
                checked={form.is_featured}
                onCheckedChange={(v) => setForm((f) => ({ ...f, is_featured: v }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Kaydediliyor...' : editingProduct ? 'Kaydet' : 'Ürün Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
