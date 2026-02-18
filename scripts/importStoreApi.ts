#!/usr/bin/env node
/**
 * WooCommerce Store API → Supabase Importer
 *
 * Uses the PUBLIC WooCommerce Store API (no auth keys required):
 *   GET /wp-json/wc/store/v1/products/categories
 *   GET /wp-json/wc/store/v1/products
 *
 * Writes to Supabase tables: collections, products, product_images, variants
 * Downloads images and copies them to Supabase Storage.
 *
 * ── Usage ──────────────────────────────────────────────────────────────────
 *   npx tsx scripts/importStoreApi.ts                  # full import
 *   npx tsx scripts/importStoreApi.ts --dry-run        # preview only
 *   npx tsx scripts/importStoreApi.ts --limit=20       # first 20 products
 *   npx tsx scripts/importStoreApi.ts --limit=20 --dry-run
 * ───────────────────────────────────────────────────────────────────────────
 */

import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// ─── Config ──────────────────────────────────────────────────────────────────

const STORE_BASE = (process.env.STORE_API_BASE ?? 'https://fitnlitt.com').replace(/\/$/, '');
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? 'product-images';
const PER_PAGE = 100;
const REQUEST_DELAY_MS = 300; // polite delay between paginated requests

// ─── CLI flags ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const LIMIT_ARG = args.find((a) => a.startsWith('--limit='));
const LIMIT = LIMIT_ARG ? parseInt(LIMIT_ARG.split('=')[1], 10) : Infinity;
const SKIP_IMAGES = args.includes('--skip-images');

// ─── Guard ────────────────────────────────────────────────────────────────────

if (!SUPABASE_URL) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL in .env');
  process.exit(1);
}
if (!SUPABASE_KEY || SUPABASE_KEY === 'your-service-role-key-here') {
  console.error('❌  Missing SUPABASE_SERVICE_ROLE_KEY in .env');
  console.error('   Get it from: Supabase Dashboard → Project Settings → API → service_role secret');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ─── WooCommerce Store API types ──────────────────────────────────────────────

interface WCPrices {
  price: string;           // minor-unit string e.g. "129900" or direct "1299.00"
  regular_price: string;
  sale_price: string;
  price_range: null | { min_amount: string; max_amount: string };
  currency_code: string;
  currency_minor_unit: number; // 2 for most currencies
}

interface WCImage {
  id: number;
  src: string;
  thumbnail: string;
  name: string;
  alt: string;
}

interface WCAttribute {
  id: number;
  name: string;
  taxonomy: string;
  has_variations: boolean;
  terms: Array<{ id: number; name: string; slug: string; default: boolean }>;
}

interface WCCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number;
  image: null | { id: number; src: string; thumbnail: string; name: string; alt: string };
  count: number;
}

interface WCProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  type: 'simple' | 'variable' | 'grouped' | 'external';
  prices: WCPrices;
  images: WCImage[];
  categories: Array<{ id: number; name: string; slug: string }>;
  attributes: WCAttribute[];
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  is_in_stock: boolean;
  on_sale: boolean;
  average_rating: string;
  review_count: number;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

/** Fetch JSON with basic error handling; throws with .status for 4xx. */
async function fetchJSON<T>(url: string): Promise<{ data: T; headers: Headers }> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'fitnlitt-importer/1.0',
    },
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    const err = Object.assign(
      new Error(`HTTP ${res.status}: ${res.statusText} — ${url}`),
      { status: res.status }
    );
    throw err;
  }

  const data = (await res.json()) as T;
  return { data, headers: res.headers };
}

/** Strip HTML tags and decode common entities. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&[a-z]+;/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Decode HTML entities in a plain title string (no tags expected, but WC sends &#8211; etc). */
function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#0*38;/g, '&')
    .replace(/&[a-z]+;/gi, '')
    .trim();
}

/**
 * Parse a WooCommerce price string to a float.
 * WC Store API returns prices in minor units (e.g. 12990 = 129.90 TRY)
 * when currency_minor_unit = 2.
 */
function parseWCPrice(raw: string, minorUnit: number): number {
  const num = parseFloat(raw);
  if (isNaN(num)) return 0;
  return minorUnit > 0 ? num / Math.pow(10, minorUnit) : num;
}

/** Slugify Turkish text. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// ─── Image upload ─────────────────────────────────────────────────────────────

/**
 * Download an image from srcUrl and upload to Supabase Storage.
 * Falls back to the original URL on any error.
 */
async function uploadImage(srcUrl: string, productSlug: string, index: number): Promise<string> {
  if (DRY_RUN || SKIP_IMAGES) return srcUrl;

  try {
    const res = await fetch(srcUrl, {
      signal: AbortSignal.timeout(20_000),
      headers: { 'User-Agent': 'fitnlitt-importer/1.0' },
    });
    if (!res.ok) throw new Error(`Image fetch HTTP ${res.status}`);

    const contentType = res.headers.get('content-type') ?? 'image/jpeg';
    const ext = contentType.split('/')[1]?.split(';')[0]?.replace('jpeg', 'jpg') ?? 'jpg';
    const path = `products/${productSlug}/${index}.${ext}`;

    const buffer = Buffer.from(await res.arrayBuffer());

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(path, buffer, { contentType, upsert: true });

    if (error) {
      console.warn(`  ⚠  Storage upload failed [${path}]: ${error.message} — keeping original URL`);
      return srcUrl;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(BUCKET).getPublicUrl(path);

    return publicUrl;
  } catch (err: any) {
    console.warn(`  ⚠  Image upload error: ${err.message} — keeping original URL`);
    return srcUrl;
  }
}

// ─── Fetch categories ─────────────────────────────────────────────────────────

async function fetchAllCategories(): Promise<WCCategory[]> {
  const url = `${STORE_BASE}/wp-json/wc/store/v1/products/categories?per_page=100&hide_empty=true`;
  console.log(`\n🗂  Fetching categories…`);
  console.log(`   ${url}`);

  try {
    const { data } = await fetchJSON<WCCategory[]>(url);
    console.log(`   ✓ Found ${data.length} categories`);
    return data;
  } catch (err: any) {
    if (err.status === 404 || err.status === 403) {
      console.warn(`  ⚠  Categories endpoint returned ${err.status} — will infer collections from products`);
      return [];
    }
    throw err;
  }
}

// ─── Fetch products (paginated) ───────────────────────────────────────────────

async function fetchAllProducts(): Promise<WCProduct[]> {
  const collected: WCProduct[] = [];
  let page = 1;
  let totalPages = 1;

  console.log(`\n📦 Fetching products…`);
  console.log(`   ${STORE_BASE}/wp-json/wc/store/v1/products`);

  while (page <= totalPages) {
    const url =
      `${STORE_BASE}/wp-json/wc/store/v1/products` +
      `?per_page=${PER_PAGE}&page=${page}&catalog_visibility=visible&status=publish`;

    try {
      const { data, headers } = await fetchJSON<WCProduct[]>(url);

      const total = parseInt(headers.get('x-wp-total') ?? String(data.length), 10);
      const pages = parseInt(headers.get('x-wp-totalpages') ?? '1', 10);
      totalPages = pages || 1;

      console.log(`   Page ${page}/${totalPages} — got ${data.length} (total on server: ${total})`);
      collected.push(...data);

      if (collected.length >= LIMIT) {
        console.log(`   Reached --limit=${LIMIT}, stopping pagination.`);
        break;
      }

      page++;
      if (page <= totalPages) await sleep(REQUEST_DELAY_MS);
    } catch (err: any) {
      if (err.status === 404 || err.status === 403) {
        printFallbackMessage(err.status, url);
        process.exit(1);
      }
      throw err;
    }
  }

  return collected.slice(0, isFinite(LIMIT) ? LIMIT : undefined);
}

function printFallbackMessage(status: number, url: string) {
  console.error(`\n❌  FALLBACK NEEDED — Store API unavailable`);
  console.error(`   Request: GET ${url}`);
  console.error(`   Status:  ${status}`);
  console.error(`\n   Possible causes:`);
  console.error(`   1. WooCommerce is not installed on ${STORE_BASE}`);
  console.error(`   2. The Store API is disabled or filtered by the site`);
  console.error(`   3. A WAF / reverse proxy is blocking /wp-json/* routes`);
  console.error(`\n   Diagnostic steps:`);
  console.error(`   curl -I "${STORE_BASE}/wp-json/wc/store/v1/products"`);
  console.error(`   curl -s "${STORE_BASE}/wp-json/" | jq '.namespaces'`);
  console.error(`\n   If you have WC REST API credentials, add to .env:`);
  console.error(`   WC_CONSUMER_KEY=ck_...`);
  console.error(`   WC_CONSUMER_SECRET=cs_...`);
  console.error(`   And switch to: /wp-json/wc/v3/products`);
}

// ─── Upsert collection ────────────────────────────────────────────────────────

async function upsertCollection(
  cat: Pick<WCCategory, 'id' | 'name' | 'slug' | 'description' | 'image'>
): Promise<string | null> {
  const row = {
    slug: cat.slug || slugify(cat.name),
    title: decodeEntities(cat.name),
    description: stripHtml(cat.description ?? ''),
    hero_image: cat.image?.src ?? null,
  };

  if (DRY_RUN) {
    console.log(`    [DRY] upsert collection → ${row.slug}`);
    return `dry-${row.slug}`;
  }

  const { data, error } = await supabase
    .from('collections')
    .upsert(row, { onConflict: 'slug' })
    .select('id')
    .single();

  if (error) {
    console.warn(`  ⚠  Collection upsert failed [${row.slug}]: ${error.message}`);
    return null;
  }

  return data.id as string;
}

// ─── Upsert product ───────────────────────────────────────────────────────────

async function upsertProduct(wc: WCProduct, collectionId: string | null): Promise<string | null> {
  const minorUnit = wc.prices?.currency_minor_unit ?? 2;
  const price = parseWCPrice(wc.prices?.price, minorUnit);
  const regularPrice = parseWCPrice(wc.prices?.regular_price, minorUnit);

  // compare_at must be strictly > price per schema check constraint
  const compare_at = regularPrice > price ? regularPrice : null;

  const row = {
    slug: wc.slug || slugify(wc.name),
    title: decodeEntities(wc.name),
    description: stripHtml(wc.description || wc.short_description || ''),
    price,
    compare_at,
    currency: wc.prices?.currency_code ?? 'TRY',
    collection_id: collectionId,
    is_active: wc.stock_status !== 'outofstock',
    is_featured: false,
  };

  if (DRY_RUN) {
    console.log(
      `    [DRY] upsert product → ${row.slug} | ${row.price} ${row.currency}` +
        (row.compare_at ? ` (was ${row.compare_at})` : '')
    );
    return `dry-${row.slug}`;
  }

  const { data, error } = await supabase
    .from('products')
    .upsert(row, { onConflict: 'slug' })
    .select('id')
    .single();

  if (error) {
    console.warn(`  ⚠  Product upsert failed [${row.slug}]: ${error.message}`);
    return null;
  }

  return data.id as string;
}

// ─── Upsert images ────────────────────────────────────────────────────────────

async function upsertImages(productId: string, wc: WCProduct): Promise<void> {
  if (!wc.images.length) return;

  if (DRY_RUN) {
    console.log(`    [DRY] upload ${wc.images.length} image(s) for ${wc.slug}`);
    return;
  }

  // Delete old images for this product then re-insert
  await supabase.from('product_images').delete().eq('product_id', productId);

  // Upload in parallel (max 3 at a time to avoid overwhelming storage)
  const CONCURRENCY = 3;
  const rows: Array<{ product_id: string; url: string; sort: number }> = [];

  for (let i = 0; i < wc.images.length; i += CONCURRENCY) {
    const batch = wc.images.slice(i, i + CONCURRENCY);
    const urls = await Promise.all(batch.map((img, j) => uploadImage(img.src, wc.slug, i + j)));
    urls.forEach((url, j) => rows.push({ product_id: productId, url, sort: i + j }));
  }

  const { error } = await supabase.from('product_images').insert(rows);
  if (error) console.warn(`  ⚠  Images insert failed [${wc.slug}]: ${error.message}`);
}

// ─── Upsert variants ──────────────────────────────────────────────────────────

/**
 * Builds a cross-product of size × color attributes.
 * If no size attribute found → "One Size".
 * If no color attribute found → "Default".
 */
function buildVariantRows(
  productId: string,
  wc: WCProduct
): Array<{ product_id: string; size: string; color: string; sku: string; price_override: null; stock: number }> {
  const sizeAttr = wc.attributes.find(
    (a) =>
      /size|beden/i.test(a.name) ||
      a.taxonomy === 'pa_size' ||
      a.taxonomy === 'pa_beden'
  );
  const colorAttr = wc.attributes.find(
    (a) =>
      /colou?r|renk/i.test(a.name) ||
      a.taxonomy === 'pa_color' ||
      a.taxonomy === 'pa_renk'
  );

  const sizes = sizeAttr?.terms.map((t) => t.name).filter(Boolean) ?? ['One Size'];
  const colors = colorAttr?.terms.map((t) => t.name).filter(Boolean) ?? ['Default'];
  const stockPerVariant = wc.is_in_stock ? 10 : 0;

  const rows: ReturnType<typeof buildVariantRows> = [];
  for (const size of sizes) {
    for (const color of colors) {
      rows.push({
        product_id: productId,
        size,
        color,
        sku: `${wc.slug}-${slugify(size)}-${slugify(color)}`,
        price_override: null,
        stock: stockPerVariant,
      });
    }
  }
  return rows;
}

async function upsertVariants(productId: string, wc: WCProduct): Promise<void> {
  const rows = buildVariantRows(productId, wc);

  if (DRY_RUN) {
    const sizes = [...new Set(rows.map((r) => r.size))];
    const colors = [...new Set(rows.map((r) => r.color))];
    console.log(
      `    [DRY] ${rows.length} variant(s) — sizes: [${sizes.join(', ')}], colors: [${colors.join(', ')}]`
    );
    return;
  }

  // Upsert on SKU uniqueness
  const { error } = await supabase
    .from('variants')
    .upsert(rows, { onConflict: 'sku' });

  if (error) console.warn(`  ⚠  Variants upsert failed [${wc.slug}]: ${error.message}`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const line = '═'.repeat(54);
  console.log(`\n${line}`);
  console.log('  WooCommerce Store API → Supabase Importer');
  console.log(line);
  console.log(`  Source : ${STORE_BASE}`);
  console.log(`  Target : ${SUPABASE_URL}`);
  console.log(`  Bucket : ${BUCKET}`);
  if (DRY_RUN)    console.log('  Mode   : 🔵 DRY RUN (no writes)');
  if (SKIP_IMAGES) console.log('  Images : ⏭  skipped (--skip-images)');
  if (isFinite(LIMIT)) console.log(`  Limit  : ${LIMIT} products`);
  console.log(line);

  // ── 1. Categories → Collections ──────────────────────────────────────────
  const wcCategories = await fetchAllCategories();
  const collectionIdBySlug = new Map<string, string>();

  for (const cat of wcCategories) {
    if (/^uncategorized$/i.test(cat.slug) || /^uncategorized$/i.test(cat.name)) continue;
    const id = await upsertCollection(cat);
    if (id) {
      collectionIdBySlug.set(cat.slug, id);
      console.log(`  ✓ collection: ${cat.name}`);
    }
  }

  // ── 2. Products ──────────────────────────────────────────────────────────
  const wcProducts = await fetchAllProducts();
  console.log(`\n🚀  Importing ${wcProducts.length} products…\n`);

  let ok = 0;
  let failed = 0;

  for (const wc of wcProducts) {
    const num = `[${ok + failed + 1}/${wcProducts.length}]`;

    // Resolve or create collection from the product's first non-uncategorized category
    let collectionId: string | null = null;
    for (const cat of wc.categories) {
      if (/^uncategorized$/i.test(cat.slug)) continue;
      if (collectionIdBySlug.has(cat.slug)) {
        collectionId = collectionIdBySlug.get(cat.slug)!;
        break;
      }
      // Create on the fly (wasn't in /categories endpoint)
      const id = await upsertCollection({ ...cat, description: '', image: null });
      if (id) {
        collectionIdBySlug.set(cat.slug, id);
        collectionId = id;
        break;
      }
    }

    // Upsert product
    const productId = await upsertProduct(wc, collectionId);
    if (!productId) {
      console.log(`  ✗ ${num} FAILED — ${wc.name}`);
      failed++;
      continue;
    }

    // Images
    await upsertImages(productId, wc);

    // Variants
    await upsertVariants(productId, wc);

    const priceStr = `${parseWCPrice(wc.prices?.price, wc.prices?.currency_minor_unit ?? 2)} ${wc.prices?.currency_code ?? 'TRY'}`;
    console.log(`  ✓ ${num} ${wc.name} — ${priceStr}`);
    ok++;
  }

  console.log(`\n${line}`);
  console.log(`  ✅  Done — ${ok} imported, ${failed} failed`);
  if (DRY_RUN) console.log('  (Dry run — no data was written to Supabase)');
  console.log(`${line}\n`);
}

main().catch((err) => {
  console.error('\n❌  Fatal:', err.message ?? err);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
