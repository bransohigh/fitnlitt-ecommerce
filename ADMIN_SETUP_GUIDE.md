# Admin Dashboard Setup Guide

This guide walks you through setting up the admin dashboard with authentication, CRUD operations, and image uploads.

## 🔐 Prerequisites

1. **Supabase Project**: You need an existing Supabase project with the database schema already set up
2. **Node.js & pnpm**: Ensure you have Node.js 18+ and pnpm installed

## 📋 Step-by-Step Setup

### 1. Install Dependencies

Install multer for file uploads:

```bash
pnpm add multer
pnpm add -D @types/multer
```

### 2. Environment Variables

Add the following to your `.env` file:

```env
# Existing variables (already configured)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NEW: Service Role Key (NEVER expose to client!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**⚠️ Security Note**: The service role key bypasses RLS and should ONLY be used server-side in `server/` directory. Never import it in `src/` files.

### 3. Enable Supabase Auth

In your Supabase dashboard:

1. Go to **Authentication** → **Settings**
2. Enable **Email** provider
3. Set **Site URL** to `http://localhost:5173`
4. Add **Redirect URLs**:
   - `http://localhost:5173`
   - `http://localhost:5173/#admin`

### 4. Create Admin User

In Supabase dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Enter email and password (e.g., `admin@yourdomain.com`)
4. Click **Create User**

### 5. Create Supabase Storage Bucket

For product image uploads:

```sql
-- Run this in Supabase SQL Editor

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

Alternatively, create the bucket via the Supabase Dashboard:

1. Go to **Storage** → **New Bucket**
2. Name: `product-images`
3. Check **Public bucket**
4. Click **Create bucket**
5. Go to bucket **Policies** and add the policies above

### 6. Run the Application

```bash
pnpm dev
```

This starts both:
- Vite dev server on `http://localhost:5173`
- Express API server on `http://localhost:3001`

### 7. Access Admin Dashboard

Navigate to: `http://localhost:5173/#admin/login`

Login with the admin credentials you created in step 4.

## 🎯 Admin Features

### ✅ Authentication
- Secure login with Supabase Auth
- Session management with automatic token refresh
- Protected routes (redirects to login if not authenticated)
- Sign out functionality

### ✅ Products Management
- **List Products**: View all products with search
- **Create Product**: Add new products with variants and images
- **Edit Product**: Update product details
- **Delete Product**: Remove products (cascades to variants/images)

### ✅ Collections Management
- **List Collections**: View all collections
- **Create Collection**: Add new collections
- **Edit Collection**: Update collection details
- **Delete Collection**: Remove collections (checks for products first)

### ✅ Image Uploads
- Upload single or multiple images
- Images stored in Supabase Storage
- Automatic file naming and organization
- Delete uploaded images

## 🔒 Security Features

### Server-Side Protection
- All admin API routes require authentication
- JWT token validation on every request
- Service role key never exposed to client
- RLS policies enforced on all database operations

### Client-Side Protection
- Protected admin routes
- Automatic redirect to login when session expires
- Auth context provides `isAuthenticated` state
- Tokens automatically included in requests

## 📂 File Structure

```
src/
├── context/
│   └── AuthContext.tsx          # Authentication state management
├── lib/
│   ├── supabase-auth.ts         # Supabase Auth client (browser)
│   └── admin-api-client.ts      # Admin API wrapper with auth
├── pages/
│   └── admin/
│       ├── AdminLogin.tsx       # Login page
│       ├── AdminDashboard.tsx   # Dashboard overview
│       ├── AdminProducts.tsx    # Products list
│       └── AdminCollections.tsx # Collections list

server/
├── middleware/
│   └── auth.js                  # JWT validation middleware
├── routes/
│   ├── admin-products.js        # CRUD for products
│   ├── admin-collections.js     # CRUD for collections
│   └── admin-upload.js          # Image upload endpoints
└── lib/
    └── supabase.js              # Supabase client (service role)
```

## 🚀 Usage Examples

### Creating a New Product

1. Go to `#admin/products`
2. Click **Create Product**
3. Fill in:
   - Name, slug, description
   - Select collection
   - Add variants (color, size, SKU, price, stock)
   - Upload product images
4. Click **Save**

### Managing Collections

1. Go to `#admin/collections`
2. Click **Create Collection**
3. Fill in name, slug, description
4. Click **Save**

### Uploading Images

Images are uploaded via the product form:
- Single image: Drag & drop or click to browse
- Multiple images: Select multiple files at once
- Images are automatically compressed and stored in Supabase Storage
- Public URLs are generated and saved to database

## 🐛 Troubleshooting

### Issue: "No authentication token available"
**Solution**: Sign out and sign back in. Your session may have expired.

### Issue: "Failed to upload image"
**Solution**: Check that the `product-images` storage bucket exists in Supabase and has the correct RLS policies.

### Issue: "Missing SUPABASE_SERVICE_ROLE_KEY"
**Solution**: Add the service role key to `.env`. Find it in Supabase Dashboard → Settings → API.

### Issue: 401 Unauthorized on admin endpoints
**Solution**: Ensure you're logged in. Check browser devtools for auth errors.

### Issue: Cannot delete collection
**Solution**: Collections with associated products cannot be deleted. First, reassign or delete the products.

## 📖 API Endpoints

### Public Endpoints (No Auth Required)
- `GET /api/products` - List products
- `GET /api/products/:slug` - Get product details
- `GET /api/collections` - List collections
- `GET /api/collections/:slug` - Get collection details
- `GET /api/search/suggest` - Search suggestions
- `GET /api/facets` - Get facets

### Admin Endpoints (Auth Required)
- `GET /api/admin/products/:id` - Get product by ID
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/collections/:id` - Get collection by ID
- `POST /api/admin/collections` - Create collection
- `PUT /api/admin/collections/:id` - Update collection
- `DELETE /api/admin/collections/:id` - Delete collection
- `POST /api/admin/upload` - Upload single image
- `POST /api/admin/upload/multiple` - Upload multiple images
- `DELETE /api/admin/upload` - Delete image

## 🔐 Security Best Practices

1. **Never commit** `.env` file to version control
2. **Never expose** `SUPABASE_SERVICE_ROLE_KEY` to client code
3. **Always validate** user input on the server
4. **Use RLS policies** for fine-grained access control
5. **Rotate keys** periodically in production
6. **Enable MFA** for admin users in production
7. **Use HTTPS** in production
8. **Rate limit** admin endpoints in production

## 🎉 Next Steps

- [ ] Add product variant editor
- [ ] Add image reordering
- [ ] Add bulk operations (import/export)
- [ ] Add activity logs
- [ ] Add role-based access control (RBAC)
- [ ] Add product analytics dashboard

## 📚 Additional Resources

- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)
- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
