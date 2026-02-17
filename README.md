# Fitnlitt E-Commerce Platform

**Premium Spor Giyim & Activewear** - Next-generation e-commerce experience

## 🚀 Özellikler

### Sayfalar
- ✅ **Home Page** - Conversion-optimized homepage with hero sections, collections, training packages
- ✅ **Product Listing (PLP)** - Advanced filtering, sorting, pagination
- ✅ **Product Detail (PDP)** - Interactive gallery, variant selection, cross-selling
- ✅ **Shopping Cart** - Real-time updates, shipping threshold progress
- ✅ **Checkout** - Streamlined checkout flow with form validation
- ✅ **About** - Brand story and values
- ✅ **Contact** - Contact form with FAQ accordion
- ✅ **Loyalty Points** - Customer rewards program

### Teknik Özellikler
- ⚡ **Vite** - Lightning-fast dev server
- ⚛️ **React 19** - Latest React features
- 📘 **TypeScript** - Type-safe development
- 🎨 **Tailwind CSS v4** - Utility-first styling
- 🧩 **shadcn/ui** - Beautiful, accessible components
- 🎬 **Framer Motion** - Smooth animations
- 🛒 **Context API** - Global state management

## 📦 Kurulum

```bash
# Dependencies yükle
pnpm install

# Dev server başlat
pnpm run dev

# Production build
pnpm run build

# Preview production build
pnpm run preview
```

## 🏗️ Proje Yapısı

```
src/
├── components/
│   ├── layout/          # Header, Footer, AnnouncementBar, etc.
│   ├── product/         # ProductCard, ProductFilter, ProductGallery
│   └── ui/              # shadcn/ui components
├── context/             # CartContext (global state)
├── data/                # products.ts (dummy data)
├── hooks/               # Custom React hooks
├── pages/               # Route components
│   ├── Home.tsx
│   ├── Collection.tsx
│   ├── ProductDetail.tsx
│   ├── Cart.tsx
│   ├── Checkout.tsx
│   ├── About.tsx
│   ├── Contact.tsx
│   └── Loyalty.tsx
└── lib/                 # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary Coral:** `#FC8181`
- **Primary Peach:** `#FED7D7`
- **Brand Black:** `#1A1A1A`
- **Brand Cream:** `#FAF7F2`
- **Success Green:** `#48BB78`

### Typography
- **Headings:** Inter (bold weights)
- **Body:** Inter (regular, medium)

## 🧩 Key Components

### Product Listing
```typescript
<ProductFilter
  filters={filters}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
  isMobile={isMobile}
/>
```

### Product Gallery
```typescript
<ProductGallery
  images={product.images}
  productName={product.name}
  hasVideo={false}
/>
```

### Variant Selectors
```typescript
<SizeSelector
  sizes={product.sizes}
  selectedSize={selectedSize}
  onSelectSize={setSelectedSize}
/>

<ColorSelector
  colors={product.colors}
  selectedColor={selectedColor}
  onSelectColor={setSelectedColor}
/>
```

## 📊 Data Models

### Product
```typescript
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  colors: { name: string; hex: string; image: string }[];
  sizes: string[];
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  fabric: string;
  care: string;
  category: string;
}
```

### Collection
```typescript
interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productIds: string[];
}
```

## 🚢 Deployment

### Build Optimization
```bash
# Analyze bundle size
pnpm run build
```

### Environment Variables
```env
VITE_API_URL=https://api.fitnlitt.com
VITE_IYZICO_KEY=your_key
VITE_GA_ID=G-XXXXXXXXXX
```

## 📈 Performance Targets

- Lighthouse Performance: **> 90**
- First Contentful Paint: **< 1.5s**
- Time to Interactive: **< 3s**
- Bundle Size (gzipped): **< 500KB**

## 🔗 Useful Links

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Framer Motion API](https://www.framer.com/motion/)
- [Production Checklist](./PRODUCTION_CHECKLIST.md)

## 📝 Next Steps

1. ✅ Complete all page implementations
2. ⏳ Add SEO metadata
3. ⏳ Implement analytics
4. ⏳ Setup error tracking (Sentry)
5. ⏳ Performance optimization
6. ⏳ Accessibility audit
7. ⏳ Unit & E2E tests

## 📄 License

MIT License - © 2025 Fitnlitt

---

**Geliştirici Notları:**
- Tüm API çağrıları şu anda mock data kullanıyor
- Ödeme entegrasyonu placeholder (iyzico)
- Authentication sistemi dummy state
- Production'a hazır olmak için `PRODUCTION_CHECKLIST.md` dosyasını inceleyin
