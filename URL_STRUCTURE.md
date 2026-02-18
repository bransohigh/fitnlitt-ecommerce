# 🗺️ URL Structure & Routing

## Overview

This project uses **hash-based routing** with Vite + React (NOT Next.js App Router).

All URLs use the format: `http://localhost:5173/#[page]/[slug]`

---

## 🏠 Public Routes

| Route | URL Example | Component |
|-------|-------------|-----------|
| Home | `#home` or `/` | `Home.tsx` |
| About | `#about` | `About.tsx` |
| Contact | `#contact` | `Contact.tsx` |
| Loyalty | `#loyalty` | `Loyalty.tsx` |
| Cart | `#cart` | `Cart.tsx` |
| Checkout | `#checkout` | `Checkout.tsx` |

---

## 🛍️ Product Routes (Dynamic)

### Collections
| Collection | URL | Products |
|------------|-----|----------|
| Crop Top | `#collection/crop-top` | 3 products |
| Spor Sütyeni | `#collection/spor-sutyeni` | 3 products |
| Önü Bağcıklı | `#collection/onu-bagcikli` | 3 products |
| Spor Tayt | `#collection/spor-tayt` | 3 products |
| Pantolon | `#collection/pantolon` | 3 products |
| Şort | `#collection/sort` | 3 products |
| Etek | `#collection/etek` | 3 products |
| Takim | `#collection/takim` | 3 products |

### Individual Products (24 total)
Each product has a unique URL with its slug:

**Format:** `#product/[slug]`

**Examples:**
```
#product/latex-korse-spor-sutyeni
#product/modal-crop-top-sari
#product/onu-bagcikli-crop-top-mor
#product/yuksek-bel-tayt-siyah
#product/basic-spor-tayt-gri
#product/pantolon-kahverengi
#product/sort-yesil
#product/tennis-etek-beyaz
#product/takim-mavi
... (24 total)
```

**How to Find All Slugs:**
```bash
curl http://localhost:3001/api/products | jq '.products[].slug'
```

---

## 🔐 Admin Routes

### Authentication
| Route | URL | Description |
|-------|-----|-------------|
| Admin Login | `#admin/login` | Supabase Auth login form |

### Protected Admin Pages
All require authentication:

| Route | URL | Component | Description |
|-------|-----|-----------|-------------|
| Dashboard | `#admin` | `AdminDashboard.tsx` | Stats overview (24 products, 8 collections) |
| Products | `#admin/products` | `AdminProducts.tsx` | Table of all 24 products |
| Collections | `#admin/collections` | `AdminCollections.tsx` | Table of 8 collections |
| Edit Product | `#admin/products/:id` | Coming soon | Edit product form |
| Edit Collection | `#admin/collections/:id` | Coming soon | Edit collection form |

---

## 🛠️ Routing Implementation

### App.tsx Routing Logic

```typescript
// Hash parsing
const hash = window.location.hash.slice(1) || 'home';
const [basePath, ...slugParts] = hash.split('/');
const slug = slugParts.join('/');

// Dynamic routing
if (basePath === 'product' && slug) {
  setRoute({ page: 'product', params: { slug } });
} else if (basePath === 'collection' && slug) {
  setRoute({ page: 'collection', params: { slug } });
} else if (basePath === 'admin' && slug) {
  setRoute({ page: `admin/${slug}` as Page, params: {} });
}
```

### Example Flow

1. User clicks product card:
   ```tsx
   <button onClick={() => window.location.href = `#product/${product.slug}`}>
   ```

2. Hash changes to `#product/latex-korse-spor-sutyeni`

3. App.tsx parses:
   ```typescript
   {
     page: 'product',
     params: { slug: 'latex-korse-spor-sutyeni' }
   }
   ```

4. Component renders:
   ```tsx
   <ProductDetail productSlug="latex-korse-spor-sutyeni" />
   ```

5. ProductDetail fetches data:
   ```typescript
   fetch(`/api/products/latex-korse-spor-sutyeni`)
   ```

---

## 🌐 API Endpoints

Backend API runs on `http://localhost:3001`

| Method | Endpoint | Description | Example |
|--------|----------|-------------|---------|
| GET | `/api/products` | List all products | Returns 24 products |
| GET | `/api/products/:slug` | Get product by slug | `/api/products/latex-korse-spor-sutyeni` |
| GET | `/api/collections` | List all collections | Returns 8 collections |
| GET | `/api/collections/:slug` | Get collection by slug | `/api/collections/crop-top` |

---

## 🧭 Navigation Examples

### From Home to Product
```
Home (#home)
  → Click "Latex Korse Spor Sütyeni" card
  → Product Detail (#product/latex-korse-spor-sutyeni)
```

### From Collection to Product
```
Home (#home)
  → Click "Collections" dropdown → "Crop Top"
  → Collection Page (#collection/crop-top)
  → Click product
  → Product Detail (#product/modal-crop-top-sari)
```

### Admin Workflow
```
Home (#home)
  → Navigate to http://localhost:5173/#admin/login
  → Enter credentials
  → Admin Dashboard (#admin)
  → Click "Products" in sidebar
  → Admin Products Page (#admin/products)
  → Click "Edit" on product
  → Edit Product Page (#admin/products/[id])
```

---

## 📝 Important Notes

### Why Hash Routing?

This is a **Vite + React** project, NOT Next.js:
- ✅ Uses hash-based routing (`#product/slug`)
- ❌ Does NOT use Next.js App Router (`/products/[slug]`)
- ✅ Single-page application (SPA)
- ✅ No server-side rendering (SSR)

### URL Structure Rules

1. **Hash Required:** All routes must start with `#`
2. **Slugs Must Exist:** Product/collection slugs must match database
3. **Case Sensitive:** Slugs are lowercase with hyphens
4. **Admin Protected:** Admin routes redirect to login if not authenticated

### Testing URLs

```bash
# Valid product URLs
http://localhost:5173/#product/latex-korse-spor-sutyeni ✅
http://localhost:5173/#product/modal-crop-top-sari ✅

# Invalid (404 or fallback)
http://localhost:5173/#product/non-existent-product ❌
http://localhost:5173/#product (no slug) ❌

# Valid collection URLs
http://localhost:5173/#collection/crop-top ✅
http://localhost:5173/#collection/spor-tayt ✅

# Invalid
http://localhost:5173/#collection/fake-collection ❌

# Admin URLs
http://localhost:5173/#admin ✅ (requires auth)
http://localhost:5173/#admin/login ✅ (public)
http://localhost:5173/#admin/products ✅ (requires auth)
```

---

## 🔍 How to Find Product/Collection Slugs

### Via API
```bash
# Get all product slugs
curl http://localhost:3001/api/products | jq '.products[].slug'

# Get all collection slugs
curl http://localhost:3001/api/collections | jq '.[].slug'
```

### Via Admin Panel
1. Go to `#admin/products`
2. Look at "Slug" column in table
3. Copy slug from there
4. Navigate to `#product/[slug]`

---

## 🚀 Quick Links

For local development:

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **Admin Login:** http://localhost:5173/#admin/login
- **Admin Dashboard:** http://localhost:5173/#admin
- **Sample Product:** http://localhost:5173/#product/latex-korse-spor-sutyeni
- **Sample Collection:** http://localhost:5173/#collection/crop-top

---

## 🎯 Summary

- ✅ 24 unique product URLs with slugs
- ✅ 8 collection URLs with slugs
- ✅ Hash-based routing (SPA)
- ✅ Protected admin routes
- ✅ Dynamic slug parsing
- ✅ API-driven data fetching

All routing is now production-ready! 🚀
