const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ibbzpkmsyjlvlosataho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliYnpwa21zeWpsdmxvc2F0YWhvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTM3NTc1OCwiZXhwIjoyMDg2OTUxNzU4fQ.dF0LvzAkKIDV99BvAUsTJidtbexUWzzFJSfyanh8IkE'
);

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XS/S', 'S/M', 'M/L', 'L/XL', 'XXS', 'XXL'];

async function main() {
  // 1. Find products that have clothing sizes
  const { data: variantRows, error: vErr } = await supabase
    .from('variants')
    .select('product_id, size')
    .in('size', CLOTHING_SIZES);

  if (vErr) { console.error('variant error:', vErr); return; }

  const clothingProductIds = [...new Set(variantRows.map(v => v.product_id))];
  console.log('Clothing products found:', clothingProductIds.length);

  // 2. Mark them all as is_featured=true
  const { data: updated, error: uErr } = await supabase
    .from('products')
    .update({ is_featured: true })
    .in('id', clothingProductIds)
    .select('slug, title');

  if (uErr) { console.error('update error:', uErr); return; }

  console.log('Updated', updated.length, 'products to is_featured=true:');
  updated.forEach(p => console.log(` - ${p.slug}: ${p.title}`));

  // 3. Verify: query like AppDataContext would (recommended sort = is_featured DESC, newest)
  const { data: previewRows } = await supabase
    .from('products')
    .select('slug, title, is_featured, created_at')
    .eq('is_active', true)
    .order('is_featured', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(8);

  console.log('\nHomepage will now show (recommended order):');
  previewRows?.forEach(p => console.log(` ${p.is_featured ? '★' : ' '} ${p.slug}`));
}

main().catch(console.error);
