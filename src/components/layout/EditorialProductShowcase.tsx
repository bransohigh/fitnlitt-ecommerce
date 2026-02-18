/**
 * EditorialProductShowcase
 * Compact left editorial hero + right horizontal product slider (4 cards in one row)
 */

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchProducts, APIProduct } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface ShowcaseProduct {
  slug: string;
  title: string;
  price: number;
  compare_at?: number | null;
  currency?: string;
  primaryImageUrl?: string;
  badgeLabel?: string;
}

interface EditorialProductShowcaseProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  collectionSlug?: string;
  products?: ShowcaseProduct[];
  bgColor?: string;
  imagePosition?: 'left' | 'right';
}

// ─── Product card: fixed width, full height flex column ────────────────────
function ShowcaseCard({ product }: { product: ShowcaseProduct }) {
  const currency = product.currency === 'TRY' ? '₺' : (product.currency ?? '₺');
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col flex-shrink-0 snap-start w-[188px] sm:w-[210px] h-full border-r border-gray-200 bg-white hover:bg-[#faf9f7] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary-coral)]"
    >
      {/* Image — fills remaining height */}
      <div className="flex-1 overflow-hidden bg-[#f7f5f2] flex items-center justify-center p-3">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl text-gray-200">✦</span>
        )}
      </div>

      {/* Info strip — fixed height at bottom */}
      <div className="flex-shrink-0 p-3 border-t border-gray-100 space-y-1">
        {product.badgeLabel && (
          <p className="text-[9px] font-bold tracking-widest uppercase text-[var(--primary-coral)]">
            {product.badgeLabel}
          </p>
        )}
        <p className="text-xs font-medium text-[var(--brand-black)] leading-snug line-clamp-2">
          {product.title}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs font-bold text-[var(--brand-black)]">
            {formatPrice(product.price)}{currency}
          </span>
          {product.compare_at && product.compare_at > product.price && (
            <span className="text-[10px] text-gray-400 line-through">
              {formatPrice(product.compare_at)}{currency}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="w-full h-7 text-[10px] font-semibold border-gray-300 text-[var(--brand-black)] hover:bg-[var(--brand-black)] hover:text-white hover:border-[var(--brand-black)] transition-colors"
          tabIndex={-1}
        >
          İncele
        </Button>
      </div>
    </Link>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col flex-shrink-0 snap-start w-[188px] sm:w-[210px] h-full border-r border-gray-200 bg-white">
      <div className="flex-1 bg-gray-100">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="flex-shrink-0 p-3 border-t border-gray-100 space-y-1.5">
        <Skeleton className="h-2.5 w-12" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-7 w-full mt-1" />
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
export function EditorialProductShowcase({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  imageSrc,
  collectionSlug,
  products: propProducts,
  bgColor = 'white',
  imagePosition = 'left',
}: EditorialProductShowcaseProps) {
  const [products, setProducts] = useState<ShowcaseProduct[]>(propProducts ?? []);
  const [loadingProducts, setLoadingProducts] = useState(!propProducts && !!collectionSlug);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (propProducts) { setProducts(propProducts); return; }
    if (!collectionSlug) return;

    let cancelled = false;
    setLoadingProducts(true);

    fetchProducts({ collection: collectionSlug, limit: 8, sort: 'recommended' })
      .then(({ items }) => {
        if (cancelled) return;
        setProducts(
          items.slice(0, 8).map((p: APIProduct) => ({
            slug: p.slug,
            title: p.title,
            price: p.price,
            compare_at: p.compare_at,
            currency: p.currency,
            primaryImageUrl: p.primaryImage?.url,
            badgeLabel: p.badges.isNew ? 'Yeni' : p.badges.isSale ? 'İndirim' : undefined,
          }))
        );
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoadingProducts(false); });

    return () => { cancelled = true; };
  }, [collectionSlug, propProducts]);

  function scrollSlider(dir: 'left' | 'right') {
    const el = sliderRef.current;
    if (!el) return;
    const cardWidth = el.querySelector('a, div')?.clientWidth ?? 210;
    el.scrollBy({ left: dir === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
  }

  const bgClass = bgColor === 'cream' ? 'bg-[var(--brand-cream)]' : 'bg-white';
  const cards   = loadingProducts ? Array.from({ length: 4 }) : products;

  // ── Hero panel ─────────────────────────────────────────────────────────
  const heroPanel = (
    <div className="relative flex-shrink-0 w-full lg:w-[240px] xl:w-[280px] h-56 lg:h-full overflow-hidden border-b border-gray-200 lg:border-b-0 lg:border-r border-gray-200">
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6 text-white">
        <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--primary-coral)] mb-1.5">
          Koleksiyon
        </p>
        <h2 className="text-lg lg:text-xl xl:text-2xl font-bold leading-snug mb-2">
          {title}
        </h2>
        <p className="text-xs text-white/75 mb-4 leading-relaxed hidden lg:block">
          {subtitle}
        </p>
        <Button
          asChild
          size="sm"
          className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] font-semibold text-xs h-8 px-4"
        >
          <Link to={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );

  // ── Slider panel ────────────────────────────────────────────────────────
  const sliderPanel = (
    <div className="relative flex-1 min-w-0 overflow-hidden">
      {/* Scroll container */}
      <div
        ref={sliderRef}
        className="flex h-full overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loadingProducts
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : cards.map((p) => <ShowcaseCard key={(p as ShowcaseProduct).slug} product={p as ShowcaseProduct} />)
        }
      </div>

      {/* Prev / Next arrows — only when not loading */}
      {!loadingProducts && products.length > 0 && (
        <>
          <button
            onClick={() => scrollSlider('left')}
            aria-label="Geri"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => scrollSlider('right')}
            aria-label="İleri"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/90 border border-gray-200 shadow flex items-center justify-center hover:bg-white transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className={`w-full ${bgClass} py-10 md:py-14`}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row overflow-hidden border border-gray-200 h-auto lg:h-[400px] xl:h-[420px]">
          {imagePosition === 'left' ? (
            <>{heroPanel}{sliderPanel}</>
          ) : (
            <>{sliderPanel}{heroPanel}</>
          )}
        </div>
      </div>
    </div>
  );
}
