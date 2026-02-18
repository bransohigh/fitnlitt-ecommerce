import React, { useState } from 'react';
import { ChevronRight, Star, Minus, Plus, Heart, Shield, Truck, RotateCcw, Headphones, Ruler } from 'lucide-react';
import { products, Product } from '@/data/products';
import { ProductCard } from '@/components/product/ProductCard';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { TrustBand } from '@/components/product/TrustBand';
import { ProductGallery } from '@/components/product/ProductGallery';
import { SizeSelector, ColorSelector } from '@/components/product/VariantSelector';
import { ProductDetails } from '@/components/product/ProductDetails';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { Badge } from '@/components/ui/badge';

export const ProductDetail: React.FC = () => {
  const product = products[0]; // Demo: using first product
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0].name);
  const [quantity, setQuantity] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const relatedProducts = products.slice(1, 5);
  const isWishlisted = isInWishlist(product.id);
  
  const selectedColorObj = product.colors.find(c => c.name === selectedColor) || product.colors[0];
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Lütfen bir beden seçin');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  const handleOpenQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCloseQuickView = () => {
    setQuickViewProduct(null);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container-custom py-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <a href="#home" className="hover:text-[var(--brand-black)]">Ana Sayfa</a>
          <ChevronRight className="w-4 h-4" />
          <a href="#collection" className="hover:text-[var(--brand-black)]">Koleksiyonlar</a>
          <ChevronRight className="w-4 h-4" />
          <a href="#collection" className="hover:text-[var(--brand-black)]">
            {product.category}
          </a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[var(--brand-black)] font-medium">{product.name}</span>
        </div>
      </div>

      {/* Product Content */}
      <div className="container-custom pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
              hasVideo={false}
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="space-y-6">
            {/* Title & Badge */}
            <div>
              {product.badge && (
                <Badge className="mb-3 bg-[var(--primary-coral)] text-white">
                  {product.badge}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviewCount} değerlendirme)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 py-4 border-y">
              <span className="text-3xl font-bold text-gray-900">₺{product.price}</span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ₺{product.compareAtPrice}
                  </span>
                  <Badge variant="destructive" className="text-sm">
                    %{discountPercent} İndirim
                  </Badge>
                </>
              )}
            </div>

            {/* Installment Info */}
            <div className="bg-[var(--brand-cream)] rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Taksit Seçenekleri:</span> 9 taksit imkanı ile
              </p>
            </div>

            {/* Color Selector */}
            <ColorSelector
              colors={product.colors}
              selectedColor={selectedColor}
              onSelectColor={setSelectedColor}
            />

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">Beden</span>
                <button
                  onClick={() => setSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-sm text-[var(--primary-coral)] hover:text-[var(--primary-peach)] font-medium transition-colors"
                >
                  <Ruler className="w-4 h-4" />
                  Beden Rehberi
                </button>
              </div>
              <SizeSelector
                sizes={product.sizes}
                selectedSize={selectedSize}
                onSelectSize={setSelectedSize}
              />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-900">Adet:</label>
                <div className="flex items-center border-2 border-gray-300 rounded-lg">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-semibold">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--brand-black)] hover:bg-gray-800 text-white h-14 text-lg"
                  size="lg"
                >
                  Sepete Ekle
                </Button>
                <Button
                  onClick={handleWishlistToggle}
                  variant="outline"
                  className={`h-14 w-14 transition-all ${
                    isWishlisted ? 'bg-red-50 border-red-500 hover:bg-red-100' : ''
                  }`}
                  size="lg"
                >
                  <Heart
                    className={`w-5 h-5 transition-all ${
                      isWishlisted ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </Button>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-[var(--primary-coral)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Güvenli Ödeme</p>
                  <p className="text-xs text-gray-600">iyzico ile</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-[var(--primary-coral)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">14 Gün İade</p>
                  <p className="text-xs text-gray-600">Koşulsuz</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-[var(--primary-coral)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Hızlı Kargo</p>
                  <p className="text-xs text-gray-600">Aynı gün</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Headphones className="w-5 h-5 text-[var(--primary-coral)] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">7/24 Destek</p>
                  <p className="text-xs text-gray-600">Her zaman</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Accordion */}
        <ProductDetails
          description={product.description}
          fabric={product.fabric}
          care={product.care}
        />
      </div>

      {/* Trust Band - Full Width */}
      <TrustBand className="my-16" />

      {/* Related Products */}
      <div className="container-custom">
        <section className="pb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Benzer Ürünler</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} onQuickView={handleOpenQuickView} />
            ))}
          </div>
        </section>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={handleCloseQuickView}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      {/* Sticky Add to Cart (Mobile) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-40">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xl font-bold">₺{product.price}</p>
            {hasDiscount && (
              <p className="text-sm text-gray-500 line-through">₺{product.compareAtPrice}</p>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-[var(--brand-black)] hover:bg-gray-800 text-white h-12"
          >
            Sepete Ekle
          </Button>
        </div>
      </div>
    </div>
  );
};
