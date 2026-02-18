import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface Hotspot {
  id: string;
  x: number; // percentage from left
  y: number; // percentage from top
  productName: string;
  productPrice: number;
  productImage: string;
  productLink: string;
}

interface StoryBlockProps {
  title: string;
  description: string;
  image: string;
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaLink?: string;
  hotspots?: Hotspot[];
}

export const StoryBlock: React.FC<StoryBlockProps> = ({
  title,
  description,
  image,
  imagePosition = 'left',
  ctaText,
  ctaLink,
  hotspots = [],
}) => {
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const isImageLeft = imagePosition === 'left';

  // Hover intent: delay open 100ms, delay close 250ms so cursor can travel to tooltip
  const openTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (openTimer.current)  clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const openHotspot = (id: string) => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
    openTimer.current = setTimeout(() => setActiveHotspot(id), 100);
  };

  const closeHotspot = () => {
    if (openTimer.current) { clearTimeout(openTimer.current); openTimer.current = null; }
    closeTimer.current = setTimeout(() => setActiveHotspot(null), 250);
  };

  const keepOpen = () => {
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }
  };

  const toggleHotspot = (id: string) =>
    setActiveHotspot(prev => (prev === id ? null : id));

  // Mobile: tap outside any hotspot closes tooltip
  useEffect(() => {
    if (activeHotspot === null) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-hotspot]')) setActiveHotspot(null);
    };
    document.addEventListener('click', handleOutsideClick, { capture: true });
    return () => document.removeEventListener('click', handleOutsideClick, { capture: true });
  }, [activeHotspot]);

  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>

      {/* ── Image + Hotspots ─────────────────────────────────── */}
      <motion.div
        initial={{ x: isImageLeft ? -30 : 30 }}
        whileInView={{ x: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className={`relative aspect-[4/5] rounded-lg ${!isImageLeft ? 'md:order-2' : ''}`}
        /* NOTE: NO overflow-hidden here — it would clip hotspot tooltips.
           overflow-hidden is applied only to the inner image wrapper below. */
      >
        {/* Image wrapper — overflow-hidden isolated to image only */}
        <div className="absolute inset-0 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        {/* Hotspots — rendered OUTSIDE the overflow-hidden image wrapper */}
        {hotspots.map((hotspot) => {
          // Edge-aware tooltip placement:
          // x > 60  → show card to the LEFT  (right-full)
          // x <= 60 → show card to the RIGHT (left-full)
          // y > 65  → anchor card BOTTOM
          // y <= 65 → anchor card TOP
          const rightSide  = hotspot.x > 60;
          const bottomSide = hotspot.y > 65;

          const hAlignClass = rightSide  ? 'right-full mr-3' : 'left-full ml-3';
          const vAlignClass = bottomSide ? 'bottom-0'        : 'top-0';

          const isActive = activeHotspot === hotspot.id;

          return (
            <div
              key={hotspot.id}
              data-hotspot
              className="absolute z-10"
              style={{
                left: `${hotspot.x}%`,
                top:  `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              onMouseEnter={() => openHotspot(hotspot.id)}
              onMouseLeave={() => closeHotspot()}
              onClick={() => toggleHotspot(hotspot.id)}
            >
              {/* Marker button */}
              <motion.button
                aria-label={`Ürünü gör: ${hotspot.productName}`}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-colors z-10
                  ${isActive
                    ? 'bg-[var(--primary-coral)] text-white'
                    : 'bg-white/90 backdrop-blur-sm text-[var(--brand-black)] hover:bg-[var(--primary-coral)] hover:text-white'
                  }`}
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.96 }}
              >
                {isActive ? <X className="w-4 h-4" /> : <Plus className="w-5 h-5" />}
                {/* Pulse ring — only when inactive */}
                {!isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/40 animate-ping pointer-events-none" />
                )}
              </motion.button>

              {/* Tooltip card — NOT inside overflow-hidden */}
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.92, y: 6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.92, y: 6 }}
                    transition={{ duration: 0.18 }}
                    className={`absolute ${hAlignClass} ${vAlignClass} w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-30`}
                    style={{ maxWidth: 'min(224px, 55vw)' }}
                    onMouseEnter={keepOpen}
                    onMouseLeave={closeHotspot}
                  >
                    {/* Product image */}
                    <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <img
                        src={hotspot.productImage}
                        alt={hotspot.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Details */}
                    <div className="p-3">
                      <p className="text-sm font-semibold text-[var(--brand-black)] leading-snug mb-1">
                        {hotspot.productName}
                      </p>
                      <p className="text-base font-bold text-[var(--primary-coral)]">
                        {formatPrice(hotspot.productPrice)}₺
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Görmek için tıkla →</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* ── Content ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: isImageLeft ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`flex flex-col justify-center ${!isImageLeft ? 'md:order-1' : ''}`}
      >
        <p className="eyebrow-text mb-3 text-[var(--primary-coral)]">Hikayemiz</p>
        <h2 className="mb-6">{title}</h2>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{description}</p>
        {ctaText && ctaLink && (
          <div>
            <Button
              size="lg"
              className="bg-[var(--brand-black)] hover:bg-gray-800 text-white"
              asChild
            >
              <Link to={ctaLink}>{ctaText}</Link>
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
