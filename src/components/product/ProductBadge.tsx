import React from 'react';
import { Flame, Tag, TrendingUp, Zap, AlertCircle } from 'lucide-react';

type BadgeType = 'new' | 'sale' | 'bestseller' | 'low-stock' | 'limited';

interface ProductBadgeProps {
  type: BadgeType;
  label?: string;
  discount?: number;
}

const badgeConfig = {
  new: {
    icon: Zap,
    className: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
    label: 'Yeni',
  },
  sale: {
    icon: Tag,
    className: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
    label: 'İndirim',
  },
  bestseller: {
    icon: TrendingUp,
    className: 'bg-gradient-to-r from-amber-500 to-amber-600 text-white',
    label: 'Çok Satan',
  },
  'low-stock': {
    icon: AlertCircle,
    className: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white',
    label: 'Son Ürünler',
  },
  limited: {
    icon: Flame,
    className: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
    label: 'Sınırlı Stok',
  },
};

export const ProductBadge: React.FC<ProductBadgeProps> = ({ type, label, discount }) => {
  const config = badgeConfig[type];
  const Icon = config.icon;
  const displayLabel = label || config.label;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${config.className}`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>
        {type === 'sale' && discount ? `%${discount}` : displayLabel}
      </span>
    </div>
  );
};
