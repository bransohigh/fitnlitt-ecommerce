import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface Package {
  name: string;
  price: number;
  duration: string;
  features: string[];
  highlighted?: boolean;
}

const packages: Package[] = [
  {
    name: 'Başlangıç',
    price: 299,
    duration: '30 Gün',
    features: [
      'Temel antrenman programı',
      'Beslenme rehberi',
      'Video egzersizler',
      'E-posta desteği',
    ],
  },
  {
    name: 'İleri Seviye',
    price: 499,
    duration: '60 Gün',
    features: [
      'İleri seviye program',
      'Özel beslenme planı',
      'Canlı online dersler',
      'WhatsApp destek grubu',
      'Haftalık takip',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 899,
    duration: '90 Gün',
    features: [
      'Kişiselleştirilmiş program',
      'Birebir koçluk',
      'Tüm canlı dersler',
      '7/24 destek',
      'Günlük takip',
      'Ürün indirimleri',
    ],
  },
];

export const TrainingPackages: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-[var(--brand-cream)]">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="eyebrow-text mb-3 text-[var(--primary-coral)]"
          >
            Dijital Programlar
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mb-4"
          >
            Antrenman Paketleri
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Hedeflerine ulaşmak için ihtiyacın olan tüm destek
          </motion.p>
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl p-8 shadow-lg ${
                pkg.highlighted
                  ? 'ring-2 ring-[var(--primary-coral)] scale-105 md:scale-110'
                  : 'hover:shadow-xl transition-shadow duration-300'
              }`}
            >
              {pkg.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--primary-coral)] text-white text-sm font-semibold px-4 py-1 rounded-full">
                  En Popüler
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
                <div className="text-4xl font-bold text-[var(--brand-black)] mb-1">
                  ₺{pkg.price}
                </div>
                <p className="text-gray-600">{pkg.duration}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[var(--primary-coral)] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  pkg.highlighted
                    ? 'bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-white'
                    : 'bg-[var(--brand-black)] hover:bg-gray-800 text-white'
                }`}
                size="lg"
              >
                Hemen Başla
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
