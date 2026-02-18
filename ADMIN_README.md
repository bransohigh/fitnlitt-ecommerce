# Admin Dashboard - Quick Reference

## 🚀 Quick Start

1. **Install multer** (already done):
   ```bash
   pnpm add multer
   ```

2. **Add to .env**:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Create admin user** in Supabase Dashboard → Authentication → Users

4. **Create storage bucket** `product-images` with public access

5. **Start the app**:
   ```bash
   pnpm dev
   ```

6. **Access admin**: [http://localhost:5173/#admin/login](http://localhost:5173/#admin/login)

## 📂 Admin URLs

- **Login**: `#admin/login`
- **Dashboard**: `#admin`
- **Products**: `#admin/products`
- **Collections**: `#admin/collections`

## 🔐 API Endpoints

### Protected Endpoints (Require Auth Header)

**Products:**
- `GET /api/admin/products/:id` - Get product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

**Collections:**
- `GET /api/admin/collections/:id` - Get collection
- `POST /api/admin/collections` - Create collection
- `PUT /api/admin/collections/:id` - Update collection
- `DELETE /api/admin/collections/:id` - Delete collection

**Uploads:**
- `POST /api/admin/upload` - Upload single image
- `POST /api/admin/upload/multiple` - Upload multiple images
- `DELETE /api/admin/upload` - Delete image

## 🛠️ Implementation Files

### Frontend (src/)
```
src/
├── context/
│   └── AuthContext.tsx          # Auth state & methods
├── lib/
│   ├── supabase-auth.ts         # Browser auth client
│   └── admin-api-client.ts      # Admin API calls
├── pages/admin/
│   ├── AdminLogin.tsx           # Login page (/admin/login)
│   ├── AdminDashboard.tsx       # Main dashboard (/admin)
│   ├── AdminProducts.tsx        # Products list (/admin/products)
│   └── AdminCollections.tsx     # Collections list (/admin/collections)
└── App.tsx                      # Updated with admin routes
```

### Backend (server/)
```
server/
├── middleware/
│   └── auth.js                  # JWT validation
├── routes/
│   ├── admin-products.js        # Products CRUD
│   ├── admin-collections.js     # Collections CRUD
│   └── admin-upload.js          # Image uploads
└── index.js                     # Routes registered
```

## ✅ Features Implemented

- ✅ Supabase Auth integration
- ✅ Protected admin routes
- ✅ JWT token validation
- ✅ Products CRUD
- ✅ Collections CRUD
- ✅ Image upload to Supabase Storage
- ✅ Auto-logout on auth failure
- ✅ Session persistence
- ✅ Search & filter
- ✅ Responsive design

## 🔒 Security Features

- ✅ Service role key server-side only
- ✅ JWT validation on all admin endpoints
- ✅ Auto-redirect to login when unauthenticated
- ✅ RLS policies enforced
- ✅ CORS configured
- ✅ Auth headers in all admin requests

## 📖 Full Documentation

See [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md) for complete setup instructions.
