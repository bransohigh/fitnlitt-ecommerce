import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StoryBlockProps {
  title: string;
  description: string;
  image: string;
  imagePosition?: 'left' | 'right';
  ctaText?: string;
  ctaLink?: string;
}

export const StoryBlock: React.FC<StoryBlockProps> = ({
  title,
  description,
  image,
  imagePosition = 'left',
  ctaText,
  ctaLink,
}) => {
  const isImageLeft = imagePosition === 'left';

  return (
    <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${!isImageLeft ? 'md:flex-row-reverse' : ''}`}>
      {/* Image */}
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
