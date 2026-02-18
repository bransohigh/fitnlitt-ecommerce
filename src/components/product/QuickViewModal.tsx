import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Heart, Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/hooks/useWishlist';
import { ProductBadge } from './ProductBadge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface QuickViewModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, open, onClose }) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string; image?: string } | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setSelectedSize(product.sizes[0]);
      setSelectedColor(product.colors[0]);
      setQuantity(1);
      setSelectedImageIndex(0);
      setAddedToCart(false);
    }
  }, [product]);

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : 0;

  // Get all available images (product images + color-specific images)
  const allImages = [
    ...product.images,
    ...product.colors.filter(c => c.image).map(c => c.image!)
  ].filter((img, index, self) => self.indexOf(img) === index); // Remove duplicates

  const currentImage = selectedColor?.image || allImages[selectedImageIndex];

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(product, selectedSize, selectedColor.name, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = () => {
    toggleWishlist(product);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const incrementQuantity = () => setQuantity((q) => Math.min(q + 1, 10));
  const decrementQuantity = () => setQuantity((q) => Math.max(q - 1, 1));

  // Determine badge type
  const getBadgeType = (): 'new' | 'sale' | 'bestseller' | 'low-stock' | null => {
    if (product.badge === 'Yeni') return 'new';
    if (product.badge === 'Çok Satan') return 'bestseller';
    if (hasDiscount) return 'sale';
    return null;
  };

  const badgeType = getBadgeType();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 gap-0 max-h-[90vh] overflow-hidden">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-[var(--brand-black)]" />
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[90vh]">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-[var(--brand-cream)] rounded-xl overflow-hidden group">
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {/* Badge */}
              {badgeType && (
                <div className="absolute top-4 left-4 z-10">
                  <ProductBadge type={badgeType} discount={badgeType === 'sale' ? discountPercent : undefined} />
                </div>
              )}

              {/* Image Navigation */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Önceki resim"
                  >
                    <ChevronLeft className="w-5 h-5 text-[var(--brand-black)]" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Sonraki resim"
                  >
                    <ChevronRight className="w-5 h-5 text-[var(--brand-black)]" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Navigation */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-[var(--brand-black)] ring-2 ring-offset-1 ring-[var(--brand-black)]'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-5">
            {/* Title & Rating */}
            <div>
              <h2 className="text-2xl font-bold text-[var(--brand-black)] mb-2">
                {product.name}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="font-medium text-[var(--brand-black)]">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewCount} değerlendirme)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 pb-5 border-b">
              <span className="text-3xl font-bold text-[var(--brand-black)]">
                {product.price}₺
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {product.compareAtPrice}₺
                  </span>
                  <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    %{discountPercent} İndirim
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="text-sm text-muted-foreground">
                <p>{product.description}</p>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2">
              <Label htmlFor="size-select" className="text-sm font-medium">
                Beden: <span className="font-bold text-[var(--brand-black)]">{selectedSize}</span>
              </Label>
              <Select value={selectedSize} onValueChange={setSelectedSize}>
                <SelectTrigger id="size-select" className="w-full">
                  <SelectValue placeholder="Beden seçin" />
                </SelectTrigger>
                <SelectContent>
                  {product.sizes.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Color Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Renk: <span className="font-bold text-[var(--brand-black)]">{selectedColor?.name}</span>
              </Label>
              <div className="flex items-center gap-2 flex-wrap">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor?.name === color.name
                        ? 'border-[var(--brand-black)] ring-2 ring-offset-2 ring-[var(--brand-black)]'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={`${color.name} rengini seç`}
                  />
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Adet</Label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Azalt"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-semibold text-[var(--brand-black)] min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= 10}
                    className="p-3 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Artır"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">
                  (Maksimum 10 adet)
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="flex-1 h-12 bg-[var(--brand-black)] text-white hover:bg-[var(--primary-coral)] hover:text-[var(--brand-black)] gap-2 font-semibold text-base transition-all"
              >
                {addedToCart ? (
                  <>
                    <span className="text-lg">✓</span>
                    Sepete Eklendi
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Sepete Ekle
                  </>
                )}
              </Button>
              <Button
                onClick={handleWishlistToggle}
                variant="outline"
                className={`h-12 px-4 transition-all border-2 ${
                  isWishlisted
                    ? 'bg-red-50 border-red-500 hover:bg-red-100'
                    : 'hover:bg-gray-50'
                }`}
                aria-label={isWishlisted ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-[var(--brand-black)]'
                  }`}
                />
              </Button>
            </div>

            {/* Product Meta */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <span className="ml-2 font-medium">{product.id}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Kategori:</span>
                <span className="ml-2 font-medium">{product.category}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
