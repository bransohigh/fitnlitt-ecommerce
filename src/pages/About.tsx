import React from 'react';
import { Heart, Award, Users, Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'Tutkumuz',
      description: 'Her kadının güçlü ve özgür hissetmesi için tasarım yapıyoruz.',
    },
    {
      icon: Award,
      title: 'Kalite',
      description: 'Premium kumaşlar ve mükemmel işçilik standartlarımız.',
    },
    {
      icon: Users,
      title: 'Topluluk',
      description: '15,000+ kadın Fitnlitt ailesi ile hareket ediyor.',
    },
    {
      icon: Leaf,
      title: 'Sürdürülebilirlik',
      description: 'Çevre dostu üretim ve ambalajlama süreçleri.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-white)]">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1920"
          alt="About Fitnlitt"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40" />
        <div className="relative z-10 container-custom text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            Hikayemiz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-2xl mx-auto"
          >
            Hareketin gücüne inanıyoruz. Her kadının kendini güçlü, rahat ve özgür hissetmesi için tasarım yapıyoruz.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <h2 className="mb-6">Misyonumuz</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fitnlitt, 2020 yılında kadınların aktif yaşam tarzlarına eşlik edecek, hem fonksiyonel hem de şık spor giyim 
            ürünleri sunmak amacıyla kuruldu. Her ürünümüz, kadınların kendilerini güçlü ve özgür hissetmeleri için özenle tasarlanıyor.
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="section-padding bg-[var(--brand-cream)]">
        <div className="container-custom">
          <h2 className="text-center mb-12">Değerlerimiz</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary-coral)] rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-[var(--brand-black)]" />
                </div>
                <h4 className="text-xl font-medium mb-2">{value.title}</h4>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/Community Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-6">Topluluğumuz</h2>
            <p className="text-lg text-muted-foreground mb-12">
              15,000'den fazla kadın Fitnlitt ailesiyle birlikte hareket ediyor. Sen de aramıza katıl!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '15K+', label: 'Mutlu Müşteri' },
                { number: '4.8/5', label: 'Ortalama Puan' },
                { number: '2.5K+', label: 'Değerlendirme' },
                { number: '50+', label: 'Ürün Çeşidi' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <p className="text-4xl font-semibold text-[var(--primary-coral)] mb-2">{stat.number}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
