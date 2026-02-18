/**
 * Admin Collections Page
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
import { Search, Plus, Edit, Trash2, Eye, AlertCircle, FolderKanban } from 'lucide-react';

interface Collection {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  hero_image: string | null;
  product_count?: number;
  is_active: boolean;
  updated_at: string;
}

const emptyForm = {
  title: '',
  slug: '',
  description: '',
  hero_image: '',
  is_active: true,
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

export function AdminCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchCollections();
  }, []);

  async function fetchCollections() {
    try {
      setLoading(true);
      const { data, error } = await supabaseAuth
        .from('collections')
        .select('id, slug, title, description, hero_image, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Product counts
      const { data: counts } = await supabaseAuth
        .from('products')
        .select('collection_id')
        .eq('is_active', true);

      const countMap: Record<string, number> = {};
      (counts ?? []).forEach((p: any) => {
        if (p.collection_id) countMap[p.collection_id] = (countMap[p.collection_id] || 0) + 1;
      });

      setCollections(
        (data ?? []).map((c: any) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          description: c.description ?? null,
          hero_image: c.hero_image ?? null,
          product_count: countMap[c.id] || 0,
          is_active: true,
          updated_at: c.created_at || new Date().toISOString(),
        }))
      );
    } catch (err: any) {
      setError(err.message || 'Failed to load collections');
    } finally {
      setLoading(false);
    }
  }

  function openAdd() {
    setEditingCollection(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(collection: Collection) {
    setEditingCollection(collection);
    setForm({
      title: collection.title,
      slug: collection.slug,
      description: collection.description ?? '',
      hero_image: collection.hero_image ?? '',
      is_active: collection.is_active,
    });
    setFormError('');
    setModalOpen(true);
  }

  function handleTitleChange(title: string) {
    setForm((f) => ({
      ...f,
      title,
      slug: editingCollection ? f.slug : slugify(title),
    }));
  }

  async function handleSave() {
    setFormError('');
    if (!form.title.trim()) { setFormError('Koleksiyon adı zorunlu.'); return; }
    if (!form.slug.trim()) { setFormError('Slug zorunlu.'); return; }

    setSaving(true);
    try {
      const payload: any = {
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        hero_image: form.hero_image.trim() || null,
      };

      if (editingCollection) {
        const { error } = await supabaseAuth.from('collections').update(payload).eq('id', editingCollection.id);
        if (error) throw error;
      } else {
        const { error } = await supabaseAuth.from('collections').insert(payload);
        if (error) throw error;
      }

      setModalOpen(false);
      await fetchCollections();
    } catch (err: any) {
      setFormError(err.message || 'Kaydedilemedi.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(collection: Collection) {
    if (!confirm(`"${collection.title}" koleksiyonunu silmek istediğinize emin misiniz?`)) return;
    const { error } = await supabaseAuth.from('collections').delete().eq('id', collection.id);
    if (error) { alert(error.message); return; }
    await fetchCollections();
  }

  const filteredCollections = collections.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminShell>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Koleksiyonlar</h1>
          <p className="text-gray-600">Koleksiyonları yönet</p>
        </div>
        <Button onClick={openAdd} size="lg">
          <Plus className="w-4 h-4 mr-2" />
          Koleksiyon Ekle
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="mb-6 p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Koleksiyon ara..."
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

      {/* Collections Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold">Koleksiyon</TableHead>
              <TableHead className="font-semibold">Slug</TableHead>
              <TableHead className="font-semibold">Açıklama</TableHead>
              <TableHead className="font-semibold">Ürünler</TableHead>
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
                  <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredCollections.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <FolderKanban className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-900 font-medium">Henüz koleksiyon yok</p>
                    <Button onClick={openAdd}>
                      <Plus className="w-4 h-4 mr-2" />
                      İlk Koleksiyonu Ekle
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              // Collection rows
              filteredCollections.map((collection) => (
                <TableRow key={collection.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{collection.title}</TableCell>
                  <TableCell className="text-sm text-gray-600 font-mono">{collection.slug}</TableCell>
                  <TableCell className="max-w-md">
                    {collection.description ? (
                      <p className="text-sm text-gray-600 truncate">{collection.description}</p>
                    ) : (
                      <span className="text-sm text-gray-400">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {collection.product_count || 0} products
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Ön izle"
                        onClick={() => window.open(`/collection/${collection.slug}`, '_blank')}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Düzenle"
                        onClick={() => openEdit(collection)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        title="Sil"
                        onClick={() => handleDelete(collection)}
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

        {!loading && filteredCollections.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              {filteredCollections.length} / {collections.length} koleksiyon gösteriliyor
            </p>
          </div>
        )}
      </Card>

      {/* Add / Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCollection ? 'Koleksiyonu Düzenle' : 'Yeni Koleksiyon Ekle'}</DialogTitle>
          </DialogHeader>

          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 py-2">
            {/* LEFT: Hero image preview */}
            <div className="space-y-3">
              <p className="font-semibold text-sm">Hero Görsel</p>
              <div className="border-2 border-dashed rounded-lg overflow-hidden aspect-[3/4] bg-gray-50 flex items-center justify-center">
                {form.hero_image ? (
                  <img
                    src={form.hero_image}
                    alt="Hero önizleme"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <p className="text-xs text-gray-400 text-center px-4">URL girilince önizleme görünür</p>
                )}
              </div>
              <div>
                <Label htmlFor="c-hero">Görsel URL</Label>
                <Input
                  id="c-hero"
                  value={form.hero_image}
                  onChange={(e) => setForm((f) => ({ ...f, hero_image: e.target.value }))}
                  placeholder="https://..."
                  className="mt-1 text-xs"
                />
              </div>
            </div>

            {/* RIGHT: Form fields */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="c-title">Koleksiyon Adı *</Label>
                <Input
                  id="c-title"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Örn: She Moves"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="c-slug">Slug *</Label>
                <Input
                  id="c-slug"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  placeholder="she-moves"
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-gray-400 mt-1">URL'de kullanılır. Örn: /collection/she-moves</p>
              </div>

              <div>
                <Label htmlFor="c-desc">Açıklama</Label>
                <Textarea
                  id="c-desc"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Koleksiyon açıklaması..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium text-sm">Aktif</p>
                  <p className="text-xs text-gray-500">Müşteriler bu koleksiyonu görebilir</p>
                </div>
                <Switch
                  checked={form.is_active}
                  onCheckedChange={(v) => setForm((f) => ({ ...f, is_active: v }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} disabled={saving}>
              İptal
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Kaydediliyor...' : editingCollection ? 'Kaydet' : 'Koleksiyon Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
