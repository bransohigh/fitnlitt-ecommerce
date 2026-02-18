# Fitnlitt E-commerce API

Production-ready REST API for the Fitnlitt e-commerce platform with faceted filters, search, and fast product listing.

## 🏗️ Architecture

This is a **hybrid Vite + Node.js/Express setup**:
- **Frontend**: Vite + React (port 5173)
- **Backend API**: Express (port 3001)
- **Database**: Supabase Postgres (free tier)
- **Deployment**: Vite proxies `/api/*` requests to Express server

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Supabase account (free tier: https://supabase.com)
- Git

## 🚀 Setup Instructions

### 1. Clone & Install Dependencies

```bash
cd /path/to/fitnlitt-ecommerce
pnpm install
```

This will install both frontend and backend dependencies including:
- `@supabase/supabase-js` - Supabase client
- `express` - API server
- `cors` - CORS middleware
- `dotenv` - Environment variables

### 2. Create Supabase Project

1. Go to https://supabase.com and create a new project
2. Wait for database to provision (~2 minutes)
3. Go to **Settings → API** and copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API_PORT=3001
```

### 4. Initialize Database

Go to your Supabase project → **SQL Editor** and run these files **in order**:

#### Step 1: Run Schema

Copy and paste the entire contents of `supabase/schema.sql` into the SQL Editor and execute.

This creates:
- ✅ 5 tables: `collections`, `products`, `product_images`, `variants`, `product_facets`
- ✅ Indexes for performance
- ✅ Row Level Security (RLS) policies
- ✅ Helper functions for badges

#### Step 2: Run Seed Data

Copy and paste the entire contents of `supabase/seed.sql` into the SQL Editor and execute.

This populates:
- ✅ 8 collections (new-in, she-moves, latex-korse, etc.)
- ✅ 24 products with realistic Turkish names
- ✅ 2-4 images per product
- ✅ 3 sizes × 2-3 colors per product (200+ variants)
- ✅ Varied stock levels (including low stock items)
- ✅ Sale prices and featured products

### 5. Start Development Server

```bash
pnpm dev
```

This starts **both**:
- ✅ Vite dev server (http://localhost:5173)
- ✅ Express API server (http://localhost:3001)

Vite automatically proxies `/api/*` requests to the Express server.

## 📡 API Endpoints

### Collections

#### `GET /api/collections`
List all collections

**Response:**
```json
{
  "collections": [
    {
      "id": "uuid",
      "slug": "new-in",
      "title": "Yeni Gelenler",
      "description": "En yeni koleksiyonumuzda...",
      "hero_image": "https://...",
      "created_at": "2025-..."
    }
  ],
  "meta": { "total": 8 }
}
```

#### `GET /api/collections/:slug`
Get collection by slug

**Example:** `/api/collections/she-moves`

---

### Products

#### `GET /api/products`
List products with filters, facets, and pagination

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `collection` | string | Filter by collection slug | `she-moves` |
| `collections` | string | Multiple collections (comma-separated) | `new-in,she-moves` |
| `q` | string | Search query (matches title) | `tayt` |
| `sort` | string | Sort order | `recommended`, `newest`, `price_asc`, `price_desc` |
| `page` | number | Page number (default: 1) | `2` |
| `limit` | number | Items per page (default: 24, max: 60) | `12` |
| `size` / `sizes` | string | Filter by sizes (comma-separated) | `S,M,L` |
| `color` / `colors` | string | Filter by colors (comma-separated) | `Siyah,Beyaz` |
| `inStock` | boolean | Only in-stock products | `true` |
| `onSale` | boolean | Only products on sale | `true` |
| `featured` | boolean | Only featured products | `true` |
| `priceMin` | number | Minimum price | `500` |
| `priceMax` | number | Maximum price | `1500` |
| `include` | string | Include related data | `images,collection` |

**Response:**
```json
{
  "items": [
    {
      "id": "uuid",
      "slug": "seamless-sports-bra-coral",
      "title": "Dikişsiz Spor Sütyeni - Mercan",
      "price": 549.99,
      "compare_at": 799.99,
      "currency": "TRY",
      "primaryImage": { "url": "https://..." },
      "variantsSummary": {
        "sizes": ["S", "M", "L"],
        "colors": ["Mercan", "Siyah", "Beyaz"],
        "minPrice": null,
        "maxPrice": null,
        "inStock": true,
        "totalStock": 115
      },
      "badges": {
        "isNew": true,
        "isSale": true,
        "isLowStock": false,
        "isFeatured": true
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 24,
    "total": 48,
    "totalPages": 2,
    "hasMore": true
  },
  "facets": {
    "sizes": [
      { "value": "S", "count": 24 },
      { "value": "M", "count": 24 },
      { "value": "L", "count": 24 }
    ],
    "colors": [
      { "value": "Siyah", "count": 18 },
      { "value": "Beyaz", "count": 12 }
    ],
    "price": { "min": 299, "max": 1799 },
    "collections": [
      { "slug": "new-in", "title": "Yeni Gelenler", "count": 8 }
    ]
  }
}
```

#### `GET /api/products/:slug`
Get product details by slug

**Example:** `/api/products/seamless-sports-bra-coral`

**Response:**
```json
{
  "product": {
    "id": "uuid",
    "slug": "seamless-sports-bra-coral",
    "title": "Dikişsiz Spor Sütyeni - Mercan",
    "description": "Yüksek performanslı dikişsiz teknoloji...",
    "price": 549.99,
    "compare_at": 799.99,
    "currency": "TRY",
    "collection": {
      "slug": "new-in",
      "title": "Yeni Gelenler",
      "description": "...",
      "hero_image": "https://..."
    },
    "images": [
      { "url": "https://...", "sort": 0 },
      { "url": "https://...", "sort": 1 }
    ],
    "variants": [
      {
        "id": "uuid",
        "size": "S",
        "color": "Mercan",
        "sku": "SSB-CRL-S",
        "price": 549.99,
        "stock": 15,
        "isInStock": true
      }
    ],
    "badges": {
      "isNew": true,
      "isSale": true,
      "isLowStock": false,
      "isFeatured": true
    }
  }
}
```

---

### Search

#### `GET /api/search/suggest`
Get search suggestions (autocomplete)

**Query Parameters:**
- `q` (required): Search query
- `limit` (optional): Max results (default: 8, max: 20)

**Example:** `/api/search/suggest?q=tayt&limit=5`

**Response:**
```json
[
  {
    "slug": "high-waist-leggings-black",
    "title": "Yüksek Bel Tayt - Siyah",
    "price": 649.99,
    "currency": "TRY",
    "primaryImageUrl": "https://...",
    "collectionSlug": "new-in"
  }
]
```

---

### Facets

#### `GET /api/facets`
Get facets (filter options) for filtered products

Accepts same query params as `/api/products` (collection, q, etc.) to compute facets based on filtered set.

**Example:** `/api/facets?collection=new-in`

**Response:**
```json
{
  "sizes": [
    { "value": "S", "count": 8 },
    { "value": "M", "count": 8 }
  ],
  "colors": [
    { "value": "Siyah", "count": 6 },
    { "value": "Beyaz", "count": 4 }
  ],
  "price": { "min": 399, "max": 799 }
}
```

---

## 🧪 Testing with cURL

### Health Check
```bash
curl http://localhost:3001/api/health
```

### List Collections
```bash
curl http://localhost:3001/api/collections
```

### Get Collection
```bash
curl http://localhost:3001/api/collections/new-in
```

### List Products (Basic)
```bash
curl http://localhost:3001/api/products?limit=5
```

### List Products (Filtered)
```bash
# Filter by collection and size
curl "http://localhost:3001/api/products?collection=new-in&sizes=S,M&limit=10"

# Search with price range
curl "http://localhost:3001/api/products?q=tayt&priceMin=500&priceMax=1000"

# On-sale products only
curl "http://localhost:3001/api/products?onSale=true&sort=price_asc"
```

### Get Product Detail
```bash
curl http://localhost:3001/api/products/seamless-sports-bra-coral
```

### Search Suggestions
```bash
curl "http://localhost:3001/api/search/suggest?q=spor"
```

### Get Facets
```bash
curl "http://localhost:3001/api/facets?collection=she-moves"
```

---

## 🎨 Frontend Integration Example

Update your existing React components to use the API:

```typescript
// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';

export function useProducts(filters: any) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams(filters);
        const response = await fetch(`/api/products?${params}`);
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [JSON.stringify(filters)]);

  return { data, loading, error };
}
```

---

## 📁 File Structure

```
/Users/zaferbaran/Downloads/repo (1)/
├── server/
│   ├── index.js                 # Express server entry point
│   ├── lib/
│   │   ├── supabase.js          # Supabase client
│   │   ├── parse.js             # Query param parsing
│   │   ├── filters.js           # Query building logic
│   │   ├── facets.js            # Facet computation
│   │   └── response.js          # Response formatters
│   └── routes/
│       ├── collections.js       # Collections endpoints
│       ├── products.js          # Products endpoints
│       ├── search.js            # Search endpoints
│       └── facets.js            # Facets endpoint
├── supabase/
│   ├── schema.sql               # Database schema
│   └── seed.sql                 # Seed data (24 products)
├── src/                         # React frontend (existing)
├── .env                         # Environment variables (create from .env.example)
├── .env.example                 # Environment template
├── package.json                 # Updated with backend deps
└── vite.config.ts               # Updated with API proxy
```

---

## 🐛 Troubleshooting

### "Missing NEXT_PUBLIC_SUPABASE_URL" error
- Ensure `.env` file exists in project root
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set
- Restart the server after adding env vars

### API returns 404
- Ensure both Vite and Express servers are running (`pnpm dev`)
- Check that Vite proxy is configured in `vite.config.ts`
- Verify Express server is listening on port 3001

### Empty product list
- Verify Supabase database has data (run seed.sql)
- Check Supabase RLS policies are enabled
- Test direct Supabase connection in SQL Editor

### CORS errors
- Should not occur with Vite proxy in dev
- For production, configure CORS in `server/index.js`

---

## 🚀 Production Deployment

### Option 1: Vercel (Recommended)
1. Add Express API as Vercel Serverless Functions
2. Move `server/routes/*.js` to `api/` directory
3. Deploy Vite build to Vercel

### Option 2: Railway/Render
1. Build Vite: `pnpm build`
2. Deploy both static files + Express server
3. Configure environment variables

### Option 3: Separate Deployments
1. Deploy Vite to Netlify/Vercel
2. Deploy Express API to Railway/Render/Fly.io
3. Update frontend to use API URL

---

## ✅ Next Steps

1. **✅ Database Setup**: Run schema.sql and seed.sql in Supabase
2. **✅ Environment Config**: Copy .env.example to .env and add credentials
3. **✅ Start Development**: Run `pnpm dev`
4. **Test API**: Use cURL examples above
5. **Frontend Integration**: Connect existing React components to API
6. **Add Wishlist API**: Extend with user-specific endpoints
7. **Add Cart API**: Implement cart management
8. **Add Orders API**: Build checkout flow

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com/)
- [Vite Proxy Configuration](https://vitejs.dev/config/server-options.html#server-proxy)

---

**Built with ❤️ for Fitnlitt E-commerce Platform**
