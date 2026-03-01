-- ============================================================
-- Fitnlitt — Orders & Customers Schema + Demo Seed Data
-- Supabase SQL Editor'da çalıştır
-- ============================================================

-- 1. CUSTOMERS TABLE
create table if not exists customers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  first_name    text,
  last_name     text,
  phone         text,
  total_spent   numeric(10,2) not null default 0,
  order_count   int not null default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- 2. ORDERS TABLE
create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  order_number     text unique not null,
  customer_id      uuid references customers(id) on delete set null,
  customer_email   text not null,
  customer_name    text not null,
  status           text not null default 'Beklemede',
  -- status values: Beklemede | İşleniyor | Kargoya Verildi | Teslim Edildi | İptal Edildi | İade
  items            jsonb not null default '[]',
  subtotal         numeric(10,2) not null default 0,
  shipping         numeric(10,2) not null default 0,
  discount         numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  shipping_address jsonb,
  notes            text,
  tracking_number  text,
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- 3. INDEXES
create index if not exists orders_customer_id_idx on orders(customer_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_created_at_idx on orders(created_at desc);

-- ============================================================
-- DEMO SEED DATA
-- ============================================================

-- Önce mevcut demo verileri temizle (varsa)
delete from orders where order_number like 'FNL-2026-%';
delete from customers where email in (
  'zeynep.kaya@gmail.com',
  'elif.sahin@hotmail.com',
  'selin.arslan@icloud.com'
);

-- Demo Customer 1: Zeynep Kaya
insert into customers (id, email, first_name, last_name, phone, total_spent, order_count, created_at)
values (
  'c1000000-0000-0000-0000-000000000001',
  'zeynep.kaya@gmail.com',
  'Zeynep',
  'Kaya',
  '+90 532 111 22 33',
  2348.98,
  2,
  now() - interval '30 days'
) on conflict (email) do nothing;

-- Demo Customer 2: Elif Şahin
insert into customers (id, email, first_name, last_name, phone, total_spent, order_count, created_at)
values (
  'c1000000-0000-0000-0000-000000000002',
  'elif.sahin@hotmail.com',
  'Elif',
  'Şahin',
  '+90 541 333 44 55',
  899.99,
  1,
  now() - interval '15 days'
) on conflict (email) do nothing;

-- Demo Customer 3: Selin Arslan
insert into customers (id, email, first_name, last_name, phone, total_spent, order_count, created_at)
values (
  'c1000000-0000-0000-0000-000000000003',
  'selin.arslan@icloud.com',
  'Selin',
  'Arslan',
  '+90 555 777 88 99',
  1499.99,
  1,
  now() - interval '7 days'
) on conflict (email) do nothing;

-- ============================================================
-- DEMO ORDERS
-- ============================================================

-- Order 1 — Zeynep (Teslim Edildi, 25 gün önce)
insert into orders (
  id, order_number, customer_id, customer_email, customer_name,
  status, items, subtotal, shipping, discount, total,
  shipping_address, tracking_number, created_at
) values (
  'b1000000-0000-0000-0000-000000000001',
  'FNL-2026-0001',
  'c1000000-0000-0000-0000-000000000001',
  'zeynep.kaya@gmail.com',
  'Zeynep Kaya',
  'Teslim Edildi',
  '[
    {"product_id": "a1111111-1111-1111-1111-111111111111", "title": "Dikişsiz Spor Sütyeni - Mercan", "size": "M", "color": "Mercan", "quantity": 1, "price": 549.99, "image": "https://images.unsplash.com/photo-1544441893-675973e31985?w=200"},
    {"product_id": "a1111111-1111-1111-1111-111111111112", "title": "Yüksek Bel Tayt - Siyah", "size": "M", "color": "Siyah", "quantity": 1, "price": 649.99, "image": "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=200"}
  ]',
  1199.98, 0.00, 0.00, 1199.98,
  '{"name": "Zeynep Kaya", "address": "Bağcılar Mah. Gül Sok. No:12 D:3", "city": "İstanbul", "district": "Bağcılar", "zip": "34200", "phone": "+90 532 111 22 33"}'::jsonb,
  'YK987654321TR',
  now() - interval '25 days'
) on conflict (order_number) do nothing;

-- Order 2 — Zeynep (Kargoya Verildi, 3 gün önce)
insert into orders (
  id, order_number, customer_id, customer_email, customer_name,
  status, items, subtotal, shipping, discount, total,
  shipping_address, tracking_number, created_at
) values (
  'b1000000-0000-0000-0000-000000000002',
  'FNL-2026-0002',
  'c1000000-0000-0000-0000-000000000001',
  'zeynep.kaya@gmail.com',
  'Zeynep Kaya',
  'Kargoya Verildi',
  '[
    {"product_id": "a6666666-6666-6666-6666-666666666661", "title": "İkinci Ten Tayt - Ten Rengi", "size": "S", "color": "Ten", "quantity": 1, "price": 749.99, "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200"},
    {"product_id": "a6666666-6666-6666-6666-666666666662", "title": "İkinci Ten Sütyen - Mocha", "size": "S", "color": "Mocha", "quantity": 1, "price": 599.99, "image": "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200"},
    {"product_id": "a7777777-7777-7777-7777-777777777771", "title": "Everyday Basic Tişört - Beyaz", "size": "M", "color": "Beyaz", "quantity": 2, "price": 299.99, "image": "https://images.unsplash.com/photo-1467043153537-a4fba2cd39ef?w=200"}
  ]',
  1949.96, 0.00, 800.96, 1149.00,
  '{"name": "Zeynep Kaya", "address": "Bağcılar Mah. Gül Sok. No:12 D:3", "city": "İstanbul", "district": "Bağcılar", "zip": "34200", "phone": "+90 532 111 22 33"}'::jsonb,
  'YK112233445TR',
  now() - interval '3 days'
) on conflict (order_number) do nothing;

-- Order 3 — Elif (Beklemede, bugün)
insert into orders (
  id, order_number, customer_id, customer_email, customer_name,
  status, items, subtotal, shipping, discount, total,
  shipping_address, created_at
) values (
  'b1000000-0000-0000-0000-000000000003',
  'FNL-2026-0003',
  'c1000000-0000-0000-0000-000000000002',
  'elif.sahin@hotmail.com',
  'Elif Şahin',
  'Beklemede',
  '[
    {"product_id": "a5555555-5555-5555-5555-555555555551", "title": "Baddie Bodysuit - Siyah", "size": "M", "color": "Siyah", "quantity": 1, "price": 899.99, "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=200"}
  ]',
  899.99, 0.00, 0.00, 899.99,
  '{"name": "Elif Şahin", "address": "Kadıköy Mah. Moda Cd. No:45", "city": "İstanbul", "district": "Kadıköy", "zip": "34710", "phone": "+90 541 333 44 55"}'::jsonb,
  now()
) on conflict (order_number) do nothing;

-- Order 4 — Selin (İşleniyor, 5 gün önce)
insert into orders (
  id, order_number, customer_id, customer_email, customer_name,
  status, items, subtotal, shipping, discount, total,
  shipping_address, created_at
) values (
  'b1000000-0000-0000-0000-000000000004',
  'FNL-2026-0004',
  'c1000000-0000-0000-0000-000000000003',
  'selin.arslan@icloud.com',
  'Selin Arslan',
  'İşleniyor',
  '[
    {"product_id": "a8888888-8888-8888-8888-888888888881", "title": "Timeless Blazer - Siyah", "size": "S", "color": "Siyah", "quantity": 1, "price": 1499.99, "image": "https://images.unsplash.com/photo-1445384763658-0400939829cd?w=200"}
  ]',
  1499.99, 0.00, 0.00, 1499.99,
  '{"name": "Selin Arslan", "address": "Beşiktaş Mah. Sinanpaşa Cd. No:7 D:5", "city": "İstanbul", "district": "Beşiktaş", "zip": "34353", "phone": "+90 555 777 88 99"}'::jsonb,
  now() - interval '5 days'
) on conflict (order_number) do nothing;
