-- Fitnlitt E-commerce Database Schema
-- Production-ready schema for Supabase Postgres

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  hero_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_collections_slug ON collections(slug);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  compare_at NUMERIC(10,2) CHECK (compare_at IS NULL OR compare_at >= price),
  currency TEXT DEFAULT 'TRY' NOT NULL,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_collection_id ON products(collection_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_price ON products(price);

-- Product images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort INTEGER DEFAULT 0
);

CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort);

-- Variants table
CREATE TABLE IF NOT EXISTS variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  color TEXT NOT NULL,
  sku TEXT UNIQUE,
  price_override NUMERIC(10,2) CHECK (price_override IS NULL OR price_override >= 0),
  stock INTEGER DEFAULT 0 CHECK (stock >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_product_id ON variants(product_id);
CREATE INDEX idx_variants_size ON variants(size);
CREATE INDEX idx_variants_color ON variants(color);
CREATE INDEX idx_variants_stock ON variants(stock);
CREATE INDEX idx_variants_sku ON variants(sku);

-- Product facets table (extensible key-value for filters)
CREATE TABLE IF NOT EXISTS product_facets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL
);

CREATE INDEX idx_product_facets_product_id ON product_facets(product_id);
CREATE INDEX idx_product_facets_key_value ON product_facets(key, value);

-- Row Level Security (RLS) policies
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_facets ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Public read collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read variants" ON variants FOR SELECT USING (true);
CREATE POLICY "Public read product_facets" ON product_facets FOR SELECT USING (true);

-- Admin write policies (service role only)
CREATE POLICY "Admin write collections" ON collections FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write products" ON products FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write product_images" ON product_images FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write variants" ON variants FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Admin write product_facets" ON product_facets FOR ALL USING (auth.role() = 'service_role');

-- Helper function: Get total stock for a product
CREATE OR REPLACE FUNCTION get_product_total_stock(p_product_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(stock), 0)::INTEGER
  FROM variants
  WHERE product_id = p_product_id;
$$ LANGUAGE SQL STABLE;

-- Helper function: Check if product is on sale
CREATE OR REPLACE FUNCTION is_product_on_sale(p_price NUMERIC, p_compare_at NUMERIC)
RETURNS BOOLEAN AS $$
  SELECT p_compare_at IS NOT NULL AND p_compare_at > p_price;
$$ LANGUAGE SQL IMMUTABLE;

-- Helper function: Check if product is new (within 21 days)
CREATE OR REPLACE FUNCTION is_product_new(p_created_at TIMESTAMPTZ)
RETURNS BOOLEAN AS $$
  SELECT p_created_at >= NOW() - INTERVAL '21 days';
$$ LANGUAGE SQL STABLE;

-- Comments for documentation
COMMENT ON TABLE collections IS 'Product collections/categories';
COMMENT ON TABLE products IS 'Main product catalog';
COMMENT ON TABLE product_images IS 'Product images with sort order';
COMMENT ON TABLE variants IS 'Product variants (size, color combinations)';
COMMENT ON TABLE product_facets IS 'Extensible product attributes for filtering';
