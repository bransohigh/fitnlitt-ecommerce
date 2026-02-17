import React from 'react';
import { motion } from 'framer-motion';

interface CollectionCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  index?: number;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
  name,
  slug,
  description,
  image,
  index = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg aspect-[3/4] cursor-pointer"
    >
      <a href={`/collection/${slug}`} className="block w-full h-full">
        {/* Image */}
        <div className="absolute inset-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-2 transform transition-transform duration-300 group-hover:translate-y-[-4px]">
            {name}
          </h3>
          <p className="text-sm md:text-base text-gray-200 mb-4 opacity-90">
            {description}
          </p>
          <div className="inline-flex items-center text-sm font-medium text-[var(--primary-coral)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span>Koleksiyonu Gör</span>
            <svg
              className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </a>
    </motion.div>
  );
};
