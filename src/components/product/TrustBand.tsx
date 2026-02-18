import React from 'react';
import { Shield, Truck, RotateCcw, Headphones, Award, Lock } from 'lucide-react';

interface TrustBandProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const trustFeatures = [
  {
    icon: Shield,
    title: 'Güvenli Ödeme',
    description: 'SSL sertifikalı güvenli ödeme altyapısı',
    color: 'text-[var(--primary-coral)]',
  },
  {
    icon: Truck,
    title: 'Hızlı Kargo',
    description: '500₺ üzeri siparişlerde ücretsiz kargo',
    color: 'text-[var(--primary-coral)]',
  },
  {
    icon: RotateCcw,
    title: '14 Gün İade',
    description: 'Koşulsuz iade garantisi',
    color: 'text-[var(--primary-coral)]',
  },
  {
    icon: Headphones,
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız',
    color: 'text-[var(--primary-coral)]',
  },
  {
    icon: Award,
    title: 'Kalite Garantisi',
    description: 'Premium kumaş ve işçilik',
    color: 'text-[var(--primary-coral)]',
  },
  {
    icon: Lock,
    title: 'Gizlilik',
    description: 'Verileriniz %100 güvende',
    color: 'text-[var(--primary-coral)]',
  },
];

export const TrustBand: React.FC<TrustBandProps> = ({ variant = 'default', className = '' }) => {
  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-[var(--brand-cream)] to-white py-8 ${className}`}>
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustFeatures.slice(0, 4).map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-black)]">{feature.title}</p>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-[var(--brand-cream)] via-white to-[var(--brand-cream)] py-16 ${className}`}>
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[var(--brand-black)] mb-3">
            Neden Fitnlitt?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Müşteri memnuniyeti ve güveniniz bizim için her şeyden önemli
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[var(--primary-coral)]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-gradient-to-br from-[var(--primary-coral)] to-[var(--primary-peach)] rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-[var(--brand-black)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-[var(--brand-black)] mb-2 group-hover:text-[var(--primary-coral)] transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Trust Badges */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 pt-8 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-5 h-5 text-green-600" />
            <span className="font-medium">256-bit SSL Şifreleme</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-5 h-5 text-blue-600" />
            <span className="font-medium">KVKK Uyumlu</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="font-medium">ISO 9001 Belgeli</span>
          </div>
        </div>
      </div>
    </div>
  );
};
