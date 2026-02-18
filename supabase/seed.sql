-- Fitnlitt E-commerce Seed Data
-- 8 collections, 24+ products with variants

-- Clear existing data (cascade will handle related tables)
TRUNCATE TABLE collections CASCADE;

-- Insert Collections
INSERT INTO collections (id, slug, title, description, hero_image) VALUES
  ('11111111-1111-1111-1111-111111111111', 'new-in', 'Yeni Gelenler', 'En yeni koleksiyonumuzda sizi bekleyen şık ve modern parçalar', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=1200'),
  ('22222222-2222-2222-2222-222222222222', 'she-moves', 'She Moves', 'Hareket eden kadın için özgür ve güçlü tasarımlar', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200'),
  ('33333333-3333-3333-3333-333333333333', 'latex-korse', 'Latex Korse', 'Cesur ve göz alıcı latex korse koleksiyonu', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=1200'),
  ('44444444-4444-4444-4444-444444444444', 'juicy-collection', 'Juicy Collection', 'Canlı renkler ve rahat kesimlerle hayatın tadını çıkar', 'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=1200'),
  ('55555555-5555-5555-5555-555555555555', 'baddie-collection', 'Baddie Collection', 'İçindeki güçlü kadını ortaya çıkar', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200'),
  ('66666666-6666-6666-6666-666666666666', '2nd-skn', '2nd SKN', 'İkinci tenin gibi rahatlık', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200'),
  ('77777777-7777-7777-7777-777777777777', 'everyday-collection', 'Everyday Collection', 'Her günün vazgeçilmezi rahat parçalar', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=1200'),
  ('88888888-8888-8888-8888-888888888888', 'timeless-collection', 'Timeless Collection', 'Zamansız şıklık ve zarafet', 'https://images.unsplash.com/photo-1445384763658-0400939829cd?w=1200');

-- Insert Products (24 products across collections)
-- New In Collection (4 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'seamless-sports-bra-coral', 'Dikişsiz Spor Sütyeni - Mercan', 'Yüksek performanslı dikişsiz teknoloji ile maksimum konfor', 549.99, 799.99, '11111111-1111-1111-1111-111111111111', true, true, NOW() - INTERVAL '5 days'),
  ('a1111111-1111-1111-1111-111111111112', 'high-waist-leggings-black', 'Yüksek Bel Tayt - Siyah', 'Karın kontrolü sağlayan yüksek bel tasarımı', 649.99, NULL, '11111111-1111-1111-1111-111111111111', true, true, NOW() - INTERVAL '10 days'),
  ('a1111111-1111-1111-1111-111111111113', 'crop-top-ribbed-white', 'Fitilli Crop Top - Beyaz', 'Rahat ve şık fitilli kumaş detayı', 449.99, 599.99, '11111111-1111-1111-1111-111111111111', true, false, NOW() - INTERVAL '15 days'),
  ('a1111111-1111-1111-1111-111111111114', 'mesh-panel-tank-grey', 'File Detaylı Atlet - Gri', 'Nefes alan file paneller ile ekstra havalandırma', 399.99, NULL, '11111111-1111-1111-1111-111111111111', true, false, NOW() - INTERVAL '8 days');

-- She Moves Collection (4 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a2222222-2222-2222-2222-222222222221', 'power-leggings-burgundy', 'Power Tayt - Bordo', 'Güçlü ve esnek yapısıyla her harekette yanınızda', 749.99, 999.99, '22222222-2222-2222-2222-222222222222', true, true, NOW() - INTERVAL '30 days'),
  ('a2222222-2222-2222-2222-222222222222', 'momentum-sports-bra-pink', 'Momentum Spor Sütyeni - Pembe', 'Yüksek destekli tasarım ile yoğun antrenmanlar için', 599.99, NULL, '22222222-2222-2222-2222-222222222222', true, false, NOW() - INTERVAL '45 days'),
  ('a2222222-2222-2222-2222-222222222223', 'flow-tank-lavender', 'Flow Atlet - Lavanta', 'Akışkan kumaş ile sınırsız hareket özgürlüğü', 429.99, 549.99, '22222222-2222-2222-2222-222222222222', true, false, NOW() - INTERVAL '60 days'),
  ('a2222222-2222-2222-2222-222222222224', 'stride-shorts-navy', 'Stride Şort - Lacivert', 'Koşu ve aktif sporlar için ideal', 499.99, NULL, '22222222-2222-2222-2222-222222222222', true, false, NOW() - INTERVAL '50 days');

-- Latex Korse Collection (3 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a3333333-3333-3333-3333-333333333331', 'latex-waist-trainer-black', 'Latex Bel Korsesi - Siyah', 'Profesyonel latex korse, mükemmel duruş için', 1299.99, NULL, '33333333-3333-3333-3333-333333333333', true, true, NOW() - INTERVAL '90 days'),
  ('a3333333-3333-3333-3333-333333333332', 'latex-corset-top-red', 'Latex Korse Üst - Kırmızı', 'Cesur ve göz alıcı tasarım', 1499.99, 1899.99, '33333333-3333-3333-3333-333333333333', true, false, NOW() - INTERVAL '100 days'),
  ('a3333333-3333-3333-3333-333333333333', 'latex-bodysuit-purple', 'Latex Body - Mor', 'Tam vücut latex bodysuit', 1799.99, NULL, '33333333-3333-3333-3333-333333333333', true, false, NOW() - INTERVAL '110 days');

-- Juicy Collection (3 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a4444444-4444-4444-4444-444444444441', 'juicy-joggers-lime', 'Juicy Eşofman Altı - Lime', 'Canlı renk ve rahat kesim', 699.99, 899.99, '44444444-4444-4444-4444-444444444444', true, false, NOW() - INTERVAL '120 days'),
  ('a4444444-4444-4444-4444-444444444442', 'juicy-hoodie-bubblegum', 'Juicy Kapşonlu - Sakız Pembesi', 'Yumuşak ve sıcak tutan kumaş', 799.99, NULL, '44444444-4444-4444-4444-444444444444', true, true, NOW() - INTERVAL '12 days'),
  ('a4444444-4444-4444-4444-444444444443', 'juicy-crop-sweatshirt-peach', 'Juicy Crop Sweatshirt - Şeftali', 'Trendy crop kesim', 649.99, 849.99, '44444444-4444-4444-4444-444444444444', true, false, NOW() - INTERVAL '130 days');

-- Baddie Collection (3 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a5555555-5555-5555-5555-555555555551', 'baddie-bodysuit-black', 'Baddie Bodysuit - Siyah', 'Vücuda oturan seksi kesim', 899.99, NULL, '55555555-5555-5555-5555-555555555555', true, true, NOW() - INTERVAL '7 days'),
  ('a5555555-5555-5555-5555-555555555552', 'baddie-mini-skirt-leather', 'Baddie Mini Etek - Deri', 'Suni deri mini etek', 799.99, 999.99, '55555555-5555-5555-5555-555555555555', true, false, NOW() - INTERVAL '140 days'),
  ('a5555555-5555-5555-5555-555555555553', 'baddie-crop-jacket-grey', 'Baddie Crop Ceket - Gri', 'Oversize crop ceket', 1199.99, NULL, '55555555-5555-5555-5555-555555555555', true, false, NOW() - INTERVAL '150 days');

-- 2nd SKN Collection (3 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a6666666-6666-6666-6666-666666666661', 'second-skin-leggings-nude', 'İkinci Ten Tayt - Ten Rengi', 'Görünmez tayt teknolojisi', 749.99, 949.99, '66666666-6666-6666-6666-666666666666', true, true, NOW() - INTERVAL '3 days'),
  ('a6666666-6666-6666-6666-666666666662', 'second-skin-bra-mocha', 'İkinci Ten Sütyen - Mocha', 'Ultra konforlu dikişsiz tasarım', 599.99, NULL, '66666666-6666-6666-6666-666666666666', true, false, NOW() - INTERVAL '160 days'),
  ('a6666666-6666-6666-6666-666666666663', 'second-skin-bodysuit-caramel', 'İkinci Ten Bodysuit - Karamel', 'Kusursuz oturma garantisiyle', 849.99, 1099.99, '66666666-6666-6666-6666-666666666666', true, false, NOW() - INTERVAL '170 days');

-- Everyday Collection (2 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a7777777-7777-7777-7777-777777777771', 'everyday-tee-basic-white', 'Everyday Basic Tişört - Beyaz', 'Her günün vazgeçilmezi pamuklu tişört', 299.99, NULL, '77777777-7777-7777-7777-777777777777', true, false, NOW() - INTERVAL '180 days'),
  ('a7777777-7777-7777-7777-777777777772', 'everyday-leggings-charcoal', 'Everyday Tayt - Antrasit', 'Günlük kullanım için rahat tayt', 549.99, 699.99, '77777777-7777-7777-7777-777777777777', true, false, NOW() - INTERVAL '190 days');

-- Timeless Collection (2 products)
INSERT INTO products (id, slug, title, description, price, compare_at, collection_id, is_active, is_featured, created_at) VALUES
  ('a8888888-8888-8888-8888-888888888881', 'timeless-blazer-black', 'Timeless Blazer - Siyah', 'Zamansız şıklık sunan klasik blazer', 1499.99, NULL, '88888888-8888-8888-8888-888888888888', true, true, NOW() - INTERVAL '200 days'),
  ('a8888888-8888-8888-8888-888888888882', 'timeless-wide-pants-cream', 'Timeless Bol Pantolon - Krem', 'Zarif ve rahat geniş paça', 1099.99, 1399.99, '88888888-8888-8888-8888-888888888888', true, false, NOW() - INTERVAL '210 days');

-- Insert Product Images (2-4 images per product)
INSERT INTO product_images (product_id, url, sort) VALUES
  -- Product 1
  ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800', 0),
  ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800', 1),
  ('a1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', 2),
  -- Product 2
  ('a1111111-1111-1111-1111-111111111112', 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800', 0),
  ('a1111111-1111-1111-1111-111111111112', 'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=800', 1),
  -- Product 3
  ('a1111111-1111-1111-1111-111111111113', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 0),
  ('a1111111-1111-1111-1111-111111111113', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=800', 1),
  ('a1111111-1111-1111-1111-111111111113', 'https://images.unsplash.com/photo-1445384763658-0400939829cd?w=800', 2),
  -- Product 4
  ('a1111111-1111-1111-1111-111111111114', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 0),
  ('a1111111-1111-1111-1111-111111111114', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', 1),
  -- Continuing for all other products...
  ('a2222222-2222-2222-2222-222222222221', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', 0),
  ('a2222222-2222-2222-2222-222222222221', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800', 1),
  ('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=800', 0),
  ('a2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 1),
  ('a2222222-2222-2222-2222-222222222223', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=800', 0),
  ('a2222222-2222-2222-2222-222222222224', 'https://images.unsplash.com/photo-1445384763658-0400939829cd?w=800', 0),
  ('a3333333-3333-3333-3333-333333333331', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', 0),
  ('a3333333-3333-3333-3333-333333333332', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 0),
  ('a3333333-3333-3333-3333-333333333333', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800', 0),
  ('a4444444-4444-4444-4444-444444444441', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800', 0),
  ('a4444444-4444-4444-4444-444444444442', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', 0),
  ('a4444444-4444-4444-4444-444444444443', 'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=800', 0),
  ('a5555555-5555-5555-5555-555555555551', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 0),
  ('a5555555-5555-5555-5555-555555555552', 'https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=800', 0),
  ('a5555555-5555-5555-5555-555555555553', 'https://images.unsplash.com/photo-1445384763658-0400939829cd?w=800', 0),
  ('a6666666-6666-6666-6666-666666666661', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800', 0),
  ('a6666666-6666-6666-6666-666666666662', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', 0),
  ('a6666666-6666-6666-6666-666666666663', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800', 0),
  ('a7777777-7777-7777-7777-777777777771', 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800', 0),
  ('a7777777-7777-7777-7777-777777777772', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800', 0),
  ('a8888888-8888-8888-8888-888888888881', 'https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=800', 0),
  ('a8888888-8888-8888-8888-888888888882', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800', 0);

-- Insert Variants (3 sizes x 2-3 colors per product)
-- Product 1: Seamless Sports Bra - Coral (S/M/L x Mercan/Siyah/Beyaz)
INSERT INTO variants (product_id, size, color, sku, stock) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'S', 'Mercan', 'SSB-CRL-S', 15),
  ('a1111111-1111-1111-1111-111111111111', 'M', 'Mercan', 'SSB-CRL-M', 25),
  ('a1111111-1111-1111-1111-111111111111', 'L', 'Mercan', 'SSB-CRL-L', 20),
  ('a1111111-1111-1111-1111-111111111111', 'S', 'Siyah', 'SSB-BLK-S', 12),
  ('a1111111-1111-1111-1111-111111111111', 'M', 'Siyah', 'SSB-BLK-M', 18),
  ('a1111111-1111-1111-1111-111111111111', 'L', 'Siyah', 'SSB-BLK-L', 10),
  ('a1111111-1111-1111-1111-111111111111', 'S', 'Beyaz', 'SSB-WHT-S', 2), -- low stock
  ('a1111111-1111-1111-1111-111111111111', 'M', 'Beyaz', 'SSB-WHT-M', 8),
  ('a1111111-1111-1111-1111-111111111111', 'L', 'Beyaz', 'SSB-WHT-L', 5);

-- Product 2: High Waist Leggings - Black
INSERT INTO variants (product_id, size, color, sku, stock) VALUES
  ('a1111111-1111-1111-1111-111111111112', 'S', 'Siyah', 'HWL-BLK-S', 30),
  ('a1111111-1111-1111-1111-111111111112', 'M', 'Siyah', 'HWL-BLK-M', 40),
  ('a1111111-1111-1111-1111-111111111112', 'L', 'Siyah', 'HWL-BLK-L', 35),
  ('a1111111-1111-1111-1111-111111111112', 'S', 'Lacivert', 'HWL-NVY-S', 20),
  ('a1111111-1111-1111-1111-111111111112', 'M', 'Lacivert', 'HWL-NVY-M', 25),
  ('a1111111-1111-1111-1111-111111111112', 'L', 'Lacivert', 'HWL-NVY-L', 18);

-- Product 3: Crop Top Ribbed - White
INSERT INTO variants (product_id, size, color, sku, stock) VALUES
  ('a1111111-1111-1111-1111-111111111113', 'S', 'Beyaz', 'CTR-WHT-S', 1), -- very low stock
  ('a1111111-1111-1111-1111-111111111113', 'M', 'Beyaz', 'CTR-WHT-M', 3),
  ('a1111111-1111-1111-1111-111111111113', 'L', 'Beyaz', 'CTR-WHT-L', 2),
  ('a1111111-1111-1111-1111-111111111113', 'S', 'Siyah', 'CTR-BLK-S', 10),
  ('a1111111-1111-1111-1111-111111111113', 'M', 'Siyah', 'CTR-BLK-M', 15),
  ('a1111111-1111-1111-1111-111111111113', 'L', 'Siyah', 'CTR-BLK-L', 12);

-- Continue with remaining products (abbreviated for brevity, but all 24 products should have variants)
-- Product 4-24: Similar pattern with varying stock levels
INSERT INTO variants (product_id, size, color, sku, stock) VALUES
  -- Product 4
  ('a1111111-1111-1111-1111-111111111114', 'S', 'Gri', 'MPT-GRY-S', 8),
  ('a1111111-1111-1111-1111-111111111114', 'M', 'Gri', 'MPT-GRY-M', 12),
  ('a1111111-1111-1111-1111-111111111114', 'L', 'Gri', 'MPT-GRY-L', 10),
  -- Product 5
  ('a2222222-2222-2222-2222-222222222221', 'S', 'Bordo', 'PWL-BRD-S', 15),
  ('a2222222-2222-2222-2222-222222222221', 'M', 'Bordo', 'PWL-BRD-M', 20),
  ('a2222222-2222-2222-2222-222222222221', 'L', 'Bordo', 'PWL-BRD-L', 18),
  ('a2222222-2222-2222-2222-222222222221', 'S', 'Siyah', 'PWL-BLK-S', 10),
  ('a2222222-2222-2222-2222-222222222221', 'M', 'Siyah', 'PWL-BLK-M', 15),
  ('a2222222-2222-2222-2222-222222222221', 'L', 'Siyah', 'PWL-BLK-L', 12),
  -- Continue pattern for all products...
  ('a2222222-2222-2222-2222-222222222222', 'S', 'Pembe', 'MSB-PNK-S', 10),
  ('a2222222-2222-2222-2222-222222222222', 'M', 'Pembe', 'MSB-PNK-M', 15),
  ('a2222222-2222-2222-2222-222222222222', 'L', 'Pembe', 'MSB-PNK-L', 12),
  ('a2222222-2222-2222-2222-222222222223', 'S', 'Lavanta', 'FLT-LAV-S', 8),
  ('a2222222-2222-2222-2222-222222222223', 'M', 'Lavanta', 'FLT-LAV-M', 10),
  ('a2222222-2222-2222-2222-222222222223', 'L', 'Lavanta', 'FLT-LAV-L', 7),
  ('a2222222-2222-2222-2222-222222222224', 'S', 'Lacivert', 'STR-NVY-S', 12),
  ('a2222222-2222-2222-2222-222222222224', 'M', 'Lacivert', 'STR-NVY-M', 18),
  ('a2222222-2222-2222-2222-222222222224', 'L', 'Lacivert', 'STR-NVY-L', 15),
  -- Latex products tend to have fewer variants
  ('a3333333-3333-3333-3333-333333333331', 'S', 'Siyah', 'LWT-BLK-S', 5),
  ('a3333333-3333-3333-3333-333333333331', 'M', 'Siyah', 'LWT-BLK-M', 8),
  ('a3333333-3333-3333-3333-333333333331', 'L', 'Siyah', 'LWT-BLK-L', 6),
  ('a3333333-3333-3333-3333-333333333332', 'S', 'Kırmızı', 'LCT-RED-S', 3),
  ('a3333333-3333-3333-3333-333333333332', 'M', 'Kırmızı', 'LCT-RED-M', 5),
  ('a3333333-3333-3333-3333-333333333332', 'L', 'Kırmızı', 'LCT-RED-L', 4),
  ('a3333333-3333-3333-3333-333333333333', 'S', 'Mor', 'LBS-PRP-S', 2),
  ('a3333333-3333-3333-3333-333333333333', 'M', 'Mor', 'LBS-PRP-M', 4),
  ('a3333333-3333-3333-3333-333333333333', 'L', 'Mor', 'LBS-PRP-L', 3),
  -- Remaining products
  ('a4444444-4444-4444-4444-444444444441', 'S', 'Lime', 'JJG-LIM-S', 10),
  ('a4444444-4444-4444-4444-444444444441', 'M', 'Lime', 'JJG-LIM-M', 15),
  ('a4444444-4444-4444-4444-444444444441', 'L', 'Lime', 'JJG-LIM-L', 12),
  ('a4444444-4444-4444-4444-444444444442', 'S', 'Pembe', 'JHD-PNK-S', 20),
  ('a4444444-4444-4444-4444-444444444442', 'M', 'Pembe', 'JHD-PNK-M', 25),
  ('a4444444-4444-4444-4444-444444444442', 'L', 'Pembe', 'JHD-PNK-L', 18),
  ('a4444444-4444-4444-4444-444444444443', 'S', 'Şeftali', 'JCS-PCH-S', 8),
  ('a4444444-4444-4444-4444-444444444443', 'M', 'Şeftali', 'JCS-PCH-M', 10),
  ('a4444444-4444-4444-4444-444444444443', 'L', 'Şeftali', 'JCS-PCH-L', 7),
  ('a5555555-5555-5555-5555-555555555551', 'S', 'Siyah', 'BBS-BLK-S', 12),
  ('a5555555-5555-5555-5555-555555555551', 'M', 'Siyah', 'BBS-BLK-M', 15),
  ('a5555555-5555-5555-5555-555555555551', 'L', 'Siyah', 'BBS-BLK-L', 10),
  ('a5555555-5555-5555-5555-555555555552', 'S', 'Siyah', 'BMS-BLK-S', 5),
  ('a5555555-5555-5555-5555-555555555552', 'M', 'Siyah', 'BMS-BLK-M', 7),
  ('a5555555-5555-5555-5555-555555555552', 'L', 'Siyah', 'BMS-BLK-L', 6),
  ('a5555555-5555-5555-5555-555555555553', 'S', 'Gri', 'BCJ-GRY-S', 8),
  ('a5555555-5555-5555-5555-555555555553', 'M', 'Gri', 'BCJ-GRY-M', 10),
  ('a5555555-5555-5555-5555-555555555553', 'L', 'Gri', 'BCJ-GRY-L', 7),
  ('a6666666-6666-6666-6666-666666666661', 'S', 'Ten', 'SSL-NDE-S', 15),
  ('a6666666-6666-6666-6666-666666666661', 'M', 'Ten', 'SSL-NDE-M', 20),
  ('a6666666-6666-6666-6666-666666666661', 'L', 'Ten', 'SSL-NDE-L', 18),
  ('a6666666-6666-6666-6666-666666666662', 'S', 'Mocha', 'SSB-MCH-S', 10),
  ('a6666666-6666-6666-6666-666666666662', 'M', 'Mocha', 'SSB-MCH-M', 12),
  ('a6666666-6666-6666-6666-666666666662', 'L', 'Mocha', 'SSB-MCH-L', 10),
  ('a6666666-6666-6666-6666-666666666663', 'S', 'Karamel', 'SSB-CAR-S', 8),
  ('a6666666-6666-6666-6666-666666666663', 'M', 'Karamel', 'SSB-CAR-M', 10),
  ('a6666666-6666-6666-6666-666666666663', 'L', 'Karamel', 'SSB-CAR-L', 7),
  ('a7777777-7777-7777-7777-777777777771', 'S', 'Beyaz', 'ETB-WHT-S', 25),
  ('a7777777-7777-7777-7777-777777777771', 'M', 'Beyaz', 'ETB-WHT-M', 30),
  ('a7777777-7777-7777-7777-777777777771', 'L', 'Beyaz', 'ETB-WHT-L', 25),
  ('a7777777-7777-7777-7777-777777777772', 'S', 'Antrasit', 'ELE-CHR-S', 18),
  ('a7777777-7777-7777-7777-777777777772', 'M', 'Antrasit', 'ELE-CHR-M', 22),
  ('a7777777-7777-7777-7777-777777777772', 'L', 'Antrasit', 'ELE-CHR-L', 20),
  ('a8888888-8888-8888-8888-888888888881', 'S', 'Siyah', 'TBL-BLK-S', 10),
  ('a8888888-8888-8888-8888-888888888881', 'M', 'Siyah', 'TBL-BLK-M', 12),
  ('a8888888-8888-8888-8888-888888888881', 'L', 'Siyah', 'TBL-BLK-L', 10),
  ('a8888888-8888-8888-8888-888888888882', 'S', 'Krem', 'TWP-CRM-S', 8),
  ('a8888888-8888-8888-8888-888888888882', 'M', 'Krem', 'TWP-CRM-M', 10),
  ('a8888888-8888-8888-8888-888888888882', 'L', 'Krem', 'TWP-CRM-L', 7);

-- Insert Product Facets (optional attributes for additional filtering)
INSERT INTO product_facets (product_id, key, value) VALUES
  ('a1111111-1111-1111-1111-111111111111', 'material', 'Nylon'),
  ('a1111111-1111-1111-1111-111111111111', 'fit', 'Slim'),
  ('a1111111-1111-1111-1111-111111111111', 'feature', 'Dikişsiz'),
  ('a1111111-1111-1111-1111-111111111111', 'feature', 'Nefes Alan'),
  ('a1111111-1111-1111-1111-111111111112', 'material', 'Spandex'),
  ('a1111111-1111-1111-1111-111111111112', 'fit', 'Compression'),
  ('a1111111-1111-1111-1111-111111111112', 'feature', 'Yüksek Bel'),
  ('a3333333-3333-3333-3333-333333333331', 'material', 'Latex'),
  ('a3333333-3333-3333-3333-333333333331', 'fit', 'Tight'),
  ('a7777777-7777-7777-7777-777777777771', 'material', 'Cotton'),
  ('a7777777-7777-7777-7777-777777777771', 'fit', 'Regular');
