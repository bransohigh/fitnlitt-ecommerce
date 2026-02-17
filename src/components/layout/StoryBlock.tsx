import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
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

  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
      {/* Image with Hotspots */}
      <motion.div
        initial={{ opacity: 0, x: isImageLeft ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`relative aspect-[4/5] rounded-lg overflow-hidden ${!isImageLeft ? 'md:order-2' : ''}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Interactive Hotspots */}
        {hotspots.map((hotspot) => (
          <div
            key={hotspot.id}
            className="absolute"
            style={{ 
              left: `${hotspot.x}%`, 
              top: `${hotspot.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
            onMouseEnter={() => setActiveHotspot(hotspot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
          >
            {/* Hotspot Marker */}
            <motion.button
              className="relative w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-10"
              whileHover={{ scale: 1.1 }}
            >
              <Plus className="w-5 h-5 text-[var(--brand-black)]" />
              
              {/* Pulse Animation */}
              <span className="absolute inset-0 rounded-full bg-white/50 animate-ping" />
            </motion.button>

            {/* Product Preview Card */}
            <AnimatePresence>
              {activeHotspot === hotspot.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 bg-white rounded-lg shadow-xl overflow-hidden z-20 pointer-events-none"
                >
                  <img
                    src={hotspot.productImage}
                    alt={hotspot.productName}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-sm text-[var(--brand-black)] mb-1">
                      {hotspot.productName}
                    </h4>
                    <p className="text-lg font-bold text-[var(--primary-coral)]">
                      {hotspot.productPrice}₺
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, x: isImageLeft ? 30 : -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`flex flex-col justify-center ${!isImageLeft ? 'md:order-1' : ''}`}
      >
        <p className="eyebrow-text mb-3 text-[var(--primary-coral)]">Hikayemiz</p>
        <h2 className="mb-6">{title}</h2>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
          {description}
        </p>
        {ctaText && ctaLink && (
          <div>
            <Button
              size="lg"
              className="bg-[var(--brand-black)] hover:bg-gray-800 text-white"
              onClick={() => window.location.href = ctaLink}
            >
              {ctaText}
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
