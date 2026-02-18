import React, { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { CollectionCard } from '@/components/layout/CollectionCard';
import { EditorialProductShowcase } from '@/components/layout/EditorialProductShowcase';
import { TrustBlocks } from '@/components/layout/TrustBlocks';
import { InstagramGallery } from '@/components/layout/InstagramGallery';
import { TrainingPackages } from '@/components/layout/TrainingPackages';
import { Skeleton } from '@/components/ui/skeleton';
import { Product } from '@/data/products';
import { useAppData } from '@/context/AppDataContext';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export const Home: React.FC = () => {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const { collections, featuredProducts, loading } = useAppData();

  const mainCollections = collections.slice(0, 5);
  const heroProducts    = featuredProducts.slice(0, 4);
  const bestSellers     = featuredProducts.slice(0, 8);

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  return (
    <div className="w-full">
      {/* Hero Section - 2 Column Layout */}
      <section className="relative min-h-[85vh] bg-[var(--brand-cream)] overflow-hidden">
        <div className="container-custom h-full min-h-[85vh] flex items-center">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-12">
            {/* Left Column - Banner + CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <p className="eyebrow-text mb-4 text-[var(--primary-coral)]">
                  2025 Koleksiyonu
                </p>
                
                <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl text-[var(--brand-black)]">
                  Sen Hareket Ettikçe<br />Güçleniyorsun
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-md">
                  İçindeki potansiyeli ortaya çıkar. Kendini özgürce ifade et.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] text-lg px-10 h-14 w-full sm:w-auto"
                >
                  Koleksiyonu Keşfet
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-[var(--brand-black)] text-[var(--brand-black)] hover:bg-[var(--brand-black)] hover:text-white text-lg px-10 h-14 w-full sm:w-auto"
                >
                  Hikayemiz
                </Button>
              </div>
            </motion.div>

            {/* Right Column - Product Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {loading
                    ? Array.from({ length: 2 }).map((_, i) => (
                        <CarouselItem key={i} className="pl-4 basis-4/5 sm:basis-3/5 lg:basis-[65%]">
                          <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
                        </CarouselItem>
                      ))
                    : heroProducts.map((product) => (
                    <CarouselItem key={product.id} className="pl-4 basis-4/5 sm:basis-3/5 lg:basis-[65%]">
                      <Link to={`/product/${product.slug}`} className="block relative aspect-[3/4] rounded-2xl overflow-hidden group">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                          <p className="text-2xl font-bold">{formatPrice(product.price)} TL</p>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex -left-4" />
                <CarouselNext className="hidden lg:flex -right-4" />
              </Carousel>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-8 h-8 text-[var(--brand-black)]" />
        </motion.div>
      </section>

      {/* Shop by Collection - Slider */}
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

          <Carousel
            opts={{
              align: 'start',
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {mainCollections.map((collection, index) => (
                <CarouselItem key={collection.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                  <CollectionCard {...collection} index={index} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
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
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                    <CarouselItem key={i} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                      <Skeleton className="w-full aspect-[3/4] rounded-xl" />
                    </CarouselItem>
                  ))
                : bestSellers.map((product) => (
                <CarouselItem key={product.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard product={product} onQuickView={handleOpenQuickView} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Editorial Showcase 1 - Hareket Eden Kadın / She Moves */}
      <EditorialProductShowcase
        title="Hareket Eden Kadın"
        subtitle="Antrenman salonunda, sokakta, hayatta... Her yerde kendini özgürce ifade et. Güç ve zarafet bir arada."
        ctaLabel="She Moves Koleksiyonu"
        ctaHref="/collection/she-moves"
        imageSrc="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200"
        collectionSlug="she-moves"
        bgColor="white"
        imagePosition="left"
      />

      {/* Editorial Showcase 2 - İkinci Ten / 2nd SKN */}
      <EditorialProductShowcase
        title="İkinci Ten"
        subtitle="Kumaşlarımız bedeninle bir bütün. Konfor ve performans aynı anda. Hareket ettiğinde seninle hareket eder."
        ctaLabel="2nd SKN Koleksiyonu"
        ctaHref="/collection/2nd-skn"
        imageSrc="https://images.unsplash.com/photo-1556906918-3b0c628c69e3?w=1200"
        collectionSlug="2nd-skn"
        bgColor="cream"
        imagePosition="right"
      />

      {/* Training Packages */}
      <TrainingPackages />

      {/* Trust Blocks */}
      <TrustBlocks />

      {/* Instagram Gallery */}
      <InstagramGallery />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={handleCloseQuickView}
      />
    </div>
  );
};
