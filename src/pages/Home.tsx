import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { CollectionCard } from '@/components/layout/CollectionCard';
import { StoryBlock } from '@/components/layout/StoryBlock';
import { TrustBlocks } from '@/components/layout/TrustBlocks';
import { InstagramGallery } from '@/components/layout/InstagramGallery';
import { TrainingPackages } from '@/components/layout/TrainingPackages';
import { products, collections } from '@/data/products';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export const Home: React.FC = () => {
  const [heroVariant] = useState<'editorial' | 'collection'>('editorial');

  // Ana koleksiyonlar (ilk 5)
  const mainCollections = collections.slice(0, 5);
  
  // Best sellers
  const bestsellerProducts = products.filter((p) => p.badge === 'Çok Satan' || p.rating >= 4.7).slice(0, 8);

  return (
    <div className="w-full">
      {/* Hero Section - 2 Varyasyon */}
      {heroVariant === 'editorial' ? (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920"
              alt="Hero"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container-custom text-center text-white max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow-text mb-4 text-[var(--primary-coral)]"
            >
              2025 Koleksiyonu
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-4xl md:text-6xl lg:text-7xl"
            >
              Sen Hareket Ettikçe<br />Güçleniyorsun
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl max-w-2xl mx-auto mb-10 text-gray-100"
            >
              İçindeki potansiyeli ortaya çıkar. Kendini özgürce ifade et.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] text-lg px-10 h-14"
              >
                Koleksiyonu Keşfet
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-[var(--brand-black)] text-lg px-10 h-14"
              >
                Hikayemiz
              </Button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          >
            <ChevronDown className="w-8 h-8 text-white" />
          </motion.div>
        </section>
      ) : (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920"
              alt="Baddie Collection"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
          </div>

          <div className="relative z-10 container-custom text-center text-white max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="eyebrow-text mb-4 text-[var(--primary-coral)]"
            >
              Baddie Collection
            </motion.p>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6 text-5xl md:text-7xl"
            >
              Cesur, Güçlü, Özgürlükçü
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] text-lg px-12 h-14"
              >
                Şimdi Alışveriş Yap
              </Button>
            </motion.div>
          </div>
        </section>
      )}

      {/* Shop by Collection */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="eyebrow-text mb-3 text-[var(--primary-coral)]"
            >
              Koleksiyonlar
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              Senin Tarzını Keşfet
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 max-w-2xl mx-auto"
            >
              Her koleksiyon, farklı bir ruhu ve enerjisi yansıtıyor
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {mainCollections.slice(0, 3).map((collection, index) => (
              <CollectionCard key={collection.id} {...collection} index={index} />
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 mt-6 lg:mt-8 max-w-4xl mx-auto">
            {mainCollections.slice(3, 5).map((collection, index) => (
              <CollectionCard key={collection.id} {...collection} index={index + 3} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Carousel */}
      <section className="py-16 md:py-24 bg-[var(--brand-cream)]">
        <div className="container-custom">
          <div className="text-center mb-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="eyebrow-text mb-3 text-[var(--primary-coral)]"
            >
              En Çok Satanlar
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mb-4"
            >
              Favoriler
            </motion.h2>
          </div>

          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {bestsellerProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Story Block 1 - She Moves */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <StoryBlock
            title="Hareket Eden Kadın"
            description="Antrenman salonunda, sokakta, hayatta... Her yerde kendini özgürce ifade et. Güç ve zarafet bir arada. Sınırları zorla, potansiyelini keşfet."
            image="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200"
            imagePosition="left"
            ctaText="She Moves Koleksiyonu"
            ctaLink="/collection/she-moves"
          />
        </div>
      </section>

      {/* Story Block 2 - 2nd SKN */}
      <section className="py-16 md:py-24 bg-[var(--brand-cream)]">
        <div className="container-custom">
          <StoryBlock
            title="İkinci Ten"
            description="Kumaşlarımız bedeninle bir bütün. Konfor ve performans aynı anda. Hareket ettiğinde seninle hareket eder, nefes alır. İkinci tenin gibi hissedersin."
            image="https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=1200"
            imagePosition="right"
            ctaText="2nd SKN Koleksiyonu"
            ctaLink="/collection/2nd-skn"
          />
        </div>
      </section>

      {/* Training Packages */}
      <TrainingPackages />

      {/* Trust Blocks */}
      <TrustBlocks />

      {/* Instagram Gallery */}
      <InstagramGallery />
    </div>
  );
};
