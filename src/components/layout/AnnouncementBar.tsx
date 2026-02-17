import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const announcements = [
  'Tüm siparişlerde ücretsiz kargo',
  '14 gün koşulsuz iade garantisi',
  'Aynı gün kargo fırsatı',
  '7/24 müşteri desteği',
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div className="w-full bg-gradient-to-r from-[var(--primary-peach)] to-[var(--primary-coral)] py-2 px-4">
      <div className="container-custom flex items-center justify-between">
        <button
          onClick={goToPrevious}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Previous announcement"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex-1 text-center overflow-hidden">
          <p className="text-sm font-medium text-[var(--brand-black)] animate-fade-in">
            {announcements[currentIndex]}
          </p>
        </div>
        
        <button
          onClick={goToNext}
          className="p-1 hover:bg-white/20 rounded transition-colors"
          aria-label="Next announcement"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
