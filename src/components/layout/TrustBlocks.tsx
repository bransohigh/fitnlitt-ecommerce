import React from 'react';
import { Shield, RotateCcw, Headphones, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

interface TrustItem {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const trustItems: TrustItem[] = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Güvenli Ödeme',
    description: 'iyzico altyapısı ile güvenli ödeme',
  },
  {
    icon: <RotateCcw className="w-8 h-8" />,
    title: '14 Gün İade',
    description: 'Koşulsuz iade garantisi',
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız',
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Hızlı Kargo',
    description: 'Aynı gün kargo fırsatı',
  },
];

export const TrustBlocks: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-[var(--brand-cream)]">
      <div className="container-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="text-[var(--primary-coral)] mb-4">{item.icon}</div>
              <h3 className="text-lg font-semibold mb-2 text-[var(--brand-black)]">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
