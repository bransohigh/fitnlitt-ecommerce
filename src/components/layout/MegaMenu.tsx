import React from 'react';
import { Link } from 'react-router-dom';
import { Collection, products } from '@/data/products';
import { ArrowRight, TrendingUp, Tag } from 'lucide-react';

interface MegaMenuProps {
  collections: Collection[];
  onClose?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({ collections, onClose }) => {
  // Featured collection for banner
  const featuredCollection = collections[0];
  
  // Best sellers (mock - in real app from API)
  const bestSellers = products.filter(p => p.badge === 'Çok Satan' || p.rating >= 4.8).slice(0, 3);

  return (
    <div 
      className="absolute top-full left-0 right-0 mt-0 glass-effect border-b border-black/5 shadow-2xl"
      onMouseLeave={onClose}
    >
      <div className="container-custom py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Collections Grid - 7 cols */}
          <div className="col-span-7">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Koleksiyonlar
              </h3>
              <Link 
                to="/collection" 
                className="text-xs text-[var(--primary-coral)] hover:underline flex items-center gap-1"
              >
                Tümünü Gör <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {collections.map((collection) => (
                <Link
                  key={collection.id}
                  to={`/collection/${collection.slug}`}
                  className="group flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors"
                  onClick={onClose}
                >
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--brand-cream)]">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-[var(--primary-coral)] transition-colors truncate">
                      {collection.name}
                    </h4>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {collection.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Banner - 3 cols */}
          <div className="col-span-3">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                Öne Çıkan
              </h3>
            </div>
            <Link 
              to={`/collection/${featuredCollection.slug}`}
              className="group block relative rounded-2xl overflow-hidden aspect-[3/4] bg-gradient-to-br from-[var(--primary-peach)] to-[var(--primary-coral)]"
              onClick={onClose}
            >
              <img
                src={featuredCollection.image}
                alt={featuredCollection.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <p className="text-xs font-medium mb-1 opacity-90">YENİ KOLEKSIYON</p>
                <h4 className="text-lg font-bold mb-1">{featuredCollection.name}</h4>
                <p className="text-xs opacity-80 mb-3 line-clamp-2">{featuredCollection.description}</p>
                <span className="inline-flex items-center text-xs font-medium gap-1 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Keşfet <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </Link>
          </div>

          {/* Best Sellers - 2 cols */}
          <div className="col-span-2">
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" />
                Çok Satanlar
              </h3>
            </div>
            <div className="space-y-3">
              {bestSellers.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  className="group flex gap-3 p-2 rounded-lg hover:bg-black/5 transition-colors"
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
                    <h5 className="text-xs font-medium text-gray-900 line-clamp-2 group-hover:text-[var(--primary-coral)] transition-colors">
                      {product.name}
                    </h5>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-bold text-[var(--brand-black)]">
                        {product.price}₺
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 line-through">
                          {product.compareAtPrice}₺
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
