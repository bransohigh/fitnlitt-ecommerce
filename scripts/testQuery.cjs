const { createClient } = require('@supabase/supabase-js');
const anon = createClient(
  'https://ibbzpkmsyjlvlosataho.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImliYnpwa21zeWpsdmxvc2F0YWhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzU3NTgsImV4cCI6MjA4Njk1MTc1OH0.FrkKKOx_2fHkC2HJ5WrBODoVSggGOztToD1Xn2sxU2k'
);

anon.from('products')
  .select(`id, slug, title, price, is_active, is_featured, created_at,
    product_images(url, sort),
    variants(id, size, color, sku, price_override, stock)`,
    { count: 'exact' })
  .eq('is_active', true)
  .order('created_at', { ascending: false })
  .range(0, 11)
  .then(({ data, error, count }) => {
    console.log('error:', error);
    console.log('total count:', count);
    console.log('returned rows:', data?.length);
    if (data?.[0]) {
      const p = data[0];
      console.log('First product:', p.slug, '|', p.title, '| price:', p.price);
      console.log('  images count:', p.product_images?.length);
      console.log('  first image:', p.product_images?.[0]?.url?.substring(0, 90));
      console.log('  variants count:', p.variants?.length);
    }
    if (data?.[5]) {
      const p = data[5];
      console.log('6th product:', p.slug, '|', p.title);
    }
  });
