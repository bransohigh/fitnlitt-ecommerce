/**
 * Browser-equivalent test: simulates exactly what AppDataContext does
 * Run with: node scripts/testContext.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ibbzpkmsyjlvlosataho.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliYnpwa21zeWpsdmxvc2F0YWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzU3NTgsImV4cCI6MjA4Njk1MTc1OH0.FrkKKOx_2fHkC2HJ5WrBODoVSggGOztToD1Xn2sxU2k';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function fetchProducts() {
  const { data, error, count } = await supabase
    .from('products')
    .select(`id, slug, title, description, price, compare_at, currency,
      is_active, is_featured, created_at,
      collections(id, slug, title, description, hero_image),
      product_images(url, sort),
      variants(id, size, color, sku, price_override, stock)`,
      { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(0, 11);

  if (error) throw error;
  return { items: data ?? [], total: count };
}

async function fetchCollections() {
  const { data, error } = await supabase
    .from('collections')
    .select('id, slug, title, description, hero_image, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return { collections: data ?? [] };
}

// Exactly like adaptProduct in AppDataContext
function adaptProduct(p) {
  const images = (p.product_images ?? []).sort((a, b) => a.sort - b.sort);
  const variants = p.variants ?? [];
  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Set(variants.map(v => v.color))];
  const totalStock = variants.reduce((s, v) => s + (v.stock ?? 0), 0);

  return {
    id: p.id,
    slug: p.slug,
    name: p.title,
    price: parseFloat(p.price),
    images: images.map(i => i.url),
    colors: colors.length > 0
      ? colors.map(c => ({ name: c, hex: '#000000', image: images[0]?.url ?? '' }))
      : [{ name: 'Default', hex: '#000000', image: images[0]?.url ?? '' }],
    sizes: sizes.length > 0 ? sizes : ['One Size'],
    inStock: totalStock > 0,
  };
}

console.log('Fetching data from Supabase (anon key)...');
Promise.all([fetchCollections(), fetchProducts()])
  .then(([colRes, prodRes]) => {
    console.log(`\n✅ Collections: ${colRes.collections.length}`);
    colRes.collections.slice(0, 3).forEach(c => console.log(`  - ${c.slug}: ${c.title}`));

    console.log(`\n✅ Products fetched: ${prodRes.items.length} (total active: ${prodRes.total})`);
    const adapted = prodRes.items.map(adaptProduct);
    adapted.slice(0, 3).forEach(p => {
      console.log(`  - ${p.slug}: ${p.name}`);
      console.log(`    price: ${p.price} TL`);
      console.log(`    images: ${p.images.length} (first: ${p.images[0]?.substring(0, 80)})`);
      console.log(`    colors: ${p.colors.map(c => c.name).join(', ')}`);
      console.log(`    sizes: ${p.sizes.join(', ')}`);
      console.log(`    inStock: ${p.inStock}`);
    });
  })
  .catch(err => console.error('❌ Error:', err));
