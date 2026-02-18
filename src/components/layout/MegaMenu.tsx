import React from 'react';
import { Link } from 'react-router-dom';
import { Collection } from '@/data/products';
import { useAppData } from '@/context/AppDataContext';
import { ArrowRight, TrendingUp, Tag } from 'lucide-react';

interface MegaMenuProps {
  collections: Collection[];
  onClose?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ collections, onClose }) => {
  const featuredCollection = collections[0];
  const { featuredProducts } = useAppData();
  const bestSellers = featuredProducts.slice(0, 3);

  return (
    <div className="w-full bg-white border-b border-gray-100 shadow-2xl">
      <div className="container-custom py-8">
        <div className="grid grid-cols-12 gap-8">

          {/* ── Collections list — 5 cols ─────────────────────── */}
          <div className="col-span-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
                Koleksiyonlar
              </h3>
              <Link
                to="/collection"
                className="text-xs text-[var(--primary-coral)] hover:underline flex items-center gap-1"
                onClick={onClose}
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.slug}`}
                  className="group flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--brand-cream)]">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-[var(--primary-coral)] transition-colors truncate leading-tight">
                      {collection.name}
                    </h4>
                    <p className="text-xs text-gray-400 truncate mt-0.5">
                      {collection.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Featured banner — 4 cols ──────────────────────── */}
          <div className="col-span-4">
            <div className="flex items-center gap-1.5 mb-4">
              <Tag className="w-3.5 h-3.5 text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Öne Çıkan</h3>
            </div>
            <Link
              to={`/collection/${featuredCollection.slug}`}
              className="group block relative rounded-2xl overflow-hidden bg-[var(--brand-cream)]"
              style={{ aspectRatio: '3/4' }}
              onClick={onClose}
            >
              <img
                src={featuredCollection.image}
                alt={featuredCollection.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 opacity-80">YENİ KOLEKSİYON</p>
                <h4 className="text-lg font-bold leading-tight mb-1">{featuredCollection.name}</h4>
                <p className="text-xs opacity-75 mb-3 line-clamp-2">{featuredCollection.description}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Keşfet <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>

          {/* ── Best sellers — 3 cols ─────────────────────────── */}
          <div className="col-span-3">
            <div className="flex items-center gap-1.5 mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Çok Satanlar</h3>
            </div>
            <div className="space-y-1">
              {bestSellers.length > 0 ? bestSellers.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group flex gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                  onClick={onClose}
                >
                  <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--brand-cream)]">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-[var(--primary-coral)] transition-colors leading-snug">
                      {product.name}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-sm font-bold text-[var(--brand-black)]">{product.price}₺</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">{product.compareAtPrice}₺</span>
                      )}
                    </div>
                  </div>
                </Link>
              )) : (
                <p className="text-xs text-gray-400 py-4">Ürün bulunamadı</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
