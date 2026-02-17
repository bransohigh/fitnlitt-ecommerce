import React from 'react';
import { Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

const instagramImages = [
  'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600',
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
  'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600',
  'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600',
  'https://images.unsplash.com/photo-1540331547168-8b63109225b7?w=600',
];

export const InstagramGallery: React.FC = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow-text mb-3 text-[var(--primary-coral)]"
          >
            @2ndskn
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            Bizi Instagram'da Takip Et
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            #2ndskn hashtag'ini kullan, senin de fotoğrafın burada olsun
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {instagramImages.map((image, index) => (
            <motion.a
              key={index}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer"
            >
              <img
                src={image}
                alt={`Instagram post ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--brand-black)] hover:text-[var(--primary-coral)] transition-colors duration-300 font-medium"
          >
            <Instagram className="w-5 h-5" />
            <span>@2ndskn hesabını ziyaret et</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
