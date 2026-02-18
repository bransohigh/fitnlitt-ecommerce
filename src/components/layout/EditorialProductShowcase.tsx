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
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';

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

// ─── Product card: matches Favoriler / ProductCard visual style ─────────────
function ShowcaseCard({ product }: { product: ShowcaseProduct }) {
  const [isHovered, setIsHovered] = useState(false);
  const currency = product.currency === 'TRY' ? '₺' : (product.currency ?? '₺');
  const hasDiscount = product.compare_at && product.compare_at > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compare_at! - product.price) / product.compare_at!) * 100)
    : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block cursor-pointer flex-shrink-0 snap-start w-[200px] sm:w-[220px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image area — same style as ProductCard */}
      <div className="relative overflow-hidden rounded-xl bg-[var(--brand-cream)] aspect-[3/4] shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-200">✦</div>
        )}

        {/* Gradient overlay on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Badge */}
        {product.badgeLabel && (
          <div className="absolute top-3 left-3 z-10">
            <span className="text-[10px] font-bold tracking-wide uppercase bg-[var(--primary-coral)] text-white px-2 py-0.5 rounded-full">
              {product.badgeLabel}
            </span>
          </div>
        )}

        {/* Action button — slides up on hover like ProductCard */}
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <Button className="w-full bg-[var(--brand-black)] text-white hover:bg-[var(--primary-coral)] hover:text-[var(--brand-black)] gap-2 shadow-xl h-11 font-semibold">
            <Eye className="w-4 h-4" />
            İncele
          </Button>
        </div>
      </div>

      {/* Info below — same as ProductCard */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-[var(--brand-black)] line-clamp-2 group-hover:text-[var(--primary-coral)] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-base font-bold text-[var(--brand-black)]">
            {formatPrice(product.price)}{currency}
          </span>
          {hasDiscount && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.compare_at!)}{currency}
              </span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                %{discountPercent} İndirim
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex-shrink-0 snap-start w-[200px] sm:w-[220px]">
      <Skeleton className="w-full aspect-[3/4] rounded-xl" />
      <div className="mt-3 space-y-2">
        <Skeleton className="h-3.5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
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
    const cardWidth = el.querySelector('a, div')?.clientWidth ?? 220;
    el.scrollBy({ left: dir === 'left' ? -cardWidth * 2 : cardWidth * 2, behavior: 'smooth' });
  }

  const bgClass = bgColor === 'cream' ? 'bg-[var(--brand-cream)]' : 'bg-white';

  // ── Hero panel — rounded-xl to match card style ────────────────────────
  const heroPanel = (
    <div className="flex-shrink-0 w-full lg:w-[220px] xl:w-[240px]">
      <div className="relative overflow-hidden rounded-xl aspect-[3/4] shadow-sm">
        <img
          src={imageSrc}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[var(--primary-coral)] mb-1.5">
            Koleksiyon
          </p>
          <h2 className="text-lg xl:text-xl font-bold leading-snug mb-2">
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
    </div>
  );

  // ── Slider panel ────────────────────────────────────────────────────────
  const sliderPanel = (
    <div className="relative flex-1 min-w-0">
      <div
        ref={sliderRef}
        className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {loadingProducts
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : products.map((p) => <ShowcaseCard key={p.slug} product={p} />)
        }
      </div>

      {/* Prev / Next arrows */}
      {!loadingProducts && products.length > 0 && (
        <>
          <button
            onClick={() => scrollSlider('left')}
            aria-label="Geri"
            className="absolute -left-3 top-[42%] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => scrollSlider('right')}
            aria-label="İleri"
            className="absolute -right-3 top-[42%] -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-700" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <div className={`w-full ${bgClass} py-16 md:py-24`}>
      <div className="container-custom">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
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
