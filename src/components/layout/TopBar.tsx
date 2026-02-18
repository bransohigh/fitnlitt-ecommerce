import React from 'react';
import { Shield, Truck, Headphones, RotateCcw } from 'lucide-react';

const trustItems = [
  { icon: Shield, text: 'Güvenli Ödeme' },
  { icon: Truck, text: 'Ücretsiz Kargo' },
  { icon: RotateCcw, text: '14 Gün İade' },
  { icon: Headphones, text: '7/24 Destek' },
];

export const TopBar: React.FC = () => {
  return (
    <div className="w-full bg-[var(--brand-cream)] border-b border-black/5">
      <div className="container-custom">
        <div className="flex items-center justify-between h-10 text-xs">
          {/* Left: Trust items */}
          <div className="hidden md:flex items-center gap-6">
            {trustItems.map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-1.5 text-gray-600">
                <Icon className="w-3.5 h-3.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Mobile: Single rotating trust item */}
          <div className="md:hidden flex items-center gap-1.5 text-gray-600">
            <Shield className="w-3.5 h-3.5" />
            <span>Güvenli Alışveriş Garantisi</span>
          </div>

          {/* Right: Language/Currency placeholders */}
          <div className="flex items-center gap-4">
            <button className="text-gray-600 hover:text-[var(--brand-black)] transition-colors">
              TR
            </button>
            <span className="text-gray-300">|</span>
            <button className="text-gray-600 hover:text-[var(--brand-black)] transition-colors">
              TL
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
