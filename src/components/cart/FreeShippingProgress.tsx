import React from 'react';
import { Truck } from 'lucide-react';
import { config } from '@/lib/config';

interface FreeShippingProgressProps {
  subtotal: number;
}

export const FreeShippingProgress: React.FC<FreeShippingProgressProps> = ({ subtotal }) => {
  const threshold = config.FREE_SHIPPING_THRESHOLD;
  const remaining = Math.max(0, threshold - subtotal);
  const progress = Math.min(100, (subtotal / threshold) * 100);
  const hasReached = subtotal >= threshold;

  return (
    <div className="px-6 py-4 bg-gradient-to-r from-[var(--brand-cream)] to-white border-b border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <Truck className={`w-4 h-4 ${hasReached ? 'text-green-600' : 'text-gray-400'}`} />
        <p className="text-xs font-medium text-gray-700">
          {hasReached ? (
            <span className="text-green-600">
              🎉 Ücretsiz kargo kazandınız!
            </span>
          ) : (
            <>
              <span className="font-bold text-[var(--primary-coral)]">{remaining}₺</span> daha
              alışveriş yapın, <span className="font-semibold">ücretsiz kargo</span> kazanın
            </>
          )}
        </p>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
            hasReached
              ? 'bg-gradient-to-r from-green-500 to-green-600'
              : 'bg-gradient-to-r from-[var(--primary-peach)] to-[var(--primary-coral)]'
          }`}
          style={{ width: `${progress}%` }}
        />
        
        {/* Animated shimmer effect when in progress */}
        {!hasReached && progress > 0 && (
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    </div>
  );
};
