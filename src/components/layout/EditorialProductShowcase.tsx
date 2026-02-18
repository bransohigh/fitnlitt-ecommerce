/**
 * EditorialProductShowcase
 * Left editorial hero + right 2×2 product grid
 *
 * Props:
 *   title, subtitle, ctaLabel, ctaHref  — hero text / CTA
 *   imageSrc                            — hero background image
 *   collectionSlug                      — auto-fetch 4 products from this collection
 *   products                            — OR pass products explicitly (overrides fetch)
 *   bgColor                             — section background ('white' | 'cream' etc.)
 *   imagePosition                       — 'left' | 'right' (which side the hero goes)
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchProducts, APIProduct } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';

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

// ─── Mini product card ────────────────────────────────────────────────────────
function ShowcaseCard({ product }: { product: ShowcaseProduct }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col bg-white hover:bg-[#faf9f7] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--primary-coral)]"
    >
      {/* Image area — fixed aspect, object-contain */}
      <div className="w-full aspect-[3/4] bg-[#f7f5f2] overflow-hidden flex items-center justify-center p-4">
        {product.primaryImageUrl ? (
          <img
            src={product.primaryImageUrl}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-4xl text-gray-300">✦</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-3 gap-1">
        {product.badgeLabel && (
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--primary-coral)]">
            {product.badgeLabel}
          </p>
        )}
        <p className="text-sm font-medium text-[var(--brand-black)] leading-snug line-clamp-2 flex-1">
          {product.title}
        </p>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-bold text-[var(--brand-black)]">
            {formatPrice(product.price)}{product.currency === 'TRY' ? '₺' : (product.currency ?? '₺')}
          </span>
          {product.compare_at && product.compare_at > product.price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.compare_at)}{product.currency === 'TRY' ? '₺' : (product.currency ?? '₺')}
            </span>
          )}
        </div>
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full text-xs font-semibold border-[var(--brand-black)] text-[var(--brand-black)] hover:bg-[var(--brand-black)] hover:text-white transition-colors"
          tabIndex={-1}
          asChild={false}
        >
          Ürünü İncele
        </Button>
      </div>
    </Link>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="flex flex-col bg-white">
      <Skeleton className="w-full aspect-[3/4]" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
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

  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
      return;
    }
    if (!collectionSlug) return;

    let cancelled = false;
    setLoadingProducts(true);

    fetchProducts({ collection: collectionSlug, limit: 4, sort: 'recommended' })
      .then(({ items }) => {
        if (cancelled) return;
        setProducts(
          items.slice(0, 4).map((p: APIProduct) => ({
            slug: p.slug,
            title: p.title,
            price: p.price,
            compare_at: p.compare_at,
            currency: p.currency,
            primaryImageUrl: p.primaryImage?.url,
            badgeLabel: p.badges.isNew
              ? 'Yeni'
              : p.badges.isSale
              ? 'İndirim'
              : p.collection?.title,
          }))
        );
      })
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });

    return () => { cancelled = true; };
  }, [collectionSlug, propProducts]);

  const bgClass =
    bgColor === 'cream' ? 'bg-[var(--brand-cream)]' : 'bg-white';

  const heroPanel = (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-0 overflow-hidden">
      {/* Hero image — covers the panel */}
      <img
        src={imageSrc}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Editorial text */}
      <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 text-white">
        <p className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--primary-coral)] mb-3">
          Koleksiyon
        </p>
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight mb-3">
          {title}
        </h2>
        <p className="text-sm lg:text-base text-white/80 mb-6 max-w-sm leading-relaxed">
          {subtitle}
        </p>
        <Button
          asChild
          size="lg"
          className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] font-semibold"
        >
          <Link to={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </div>
  );

  const gridPanel = (
    /* gap-px + bg-gray-200 = catalog-style thin grid lines */
    <div className="w-full h-full grid grid-cols-2 gap-px bg-gray-200">
      {loadingProducts
        ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        : products.length > 0
        ? products.slice(0, 4).map((p) => <ShowcaseCard key={p.slug} product={p} />)
        : /* Fallback ghost cards */ Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-white flex items-center justify-center">
              <span className="text-gray-300 text-sm">Yükleniyor…</span>
            </div>
          ))}
    </div>
  );

  return (
    <div className={`w-full ${bgClass}`}>
      <div className="container-custom py-16 md:py-24">
        {/* Desktop 2-column, Mobile stack */}
        <div
          className={
            imagePosition === 'left'
              ? 'grid grid-cols-1 lg:grid-cols-[38%_62%] lg:min-h-[580px] overflow-hidden border border-gray-200'
              : 'grid grid-cols-1 lg:grid-cols-[62%_38%] lg:min-h-[580px] overflow-hidden border border-gray-200'
          }
        >
          {imagePosition === 'left' ? (
            <>
              <div className="relative border-b border-gray-200 lg:border-b-0 lg:border-r border-gray-200">{heroPanel}</div>
              <div className="relative">{gridPanel}</div>
            </>
          ) : (
            <>
              <div className="relative">{gridPanel}</div>
              <div className="relative border-t border-gray-200 lg:border-t-0 lg:border-l border-gray-200">{heroPanel}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
