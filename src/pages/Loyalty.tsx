import React from 'react';
import { Gift, ShoppingBag, Award, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { useAppData } from '@/context/AppDataContext';
import { motion } from 'framer-motion';

export const Loyalty: React.FC = () => {
  const { featuredProducts } = useAppData();
  const currentPoints = 1250; // Demo: logged in user points
  const isLoggedIn = true; // Demo state

  const howItWorks = [
    {
      icon: ShoppingBag,
      title: 'Alışveriş Yap',
      description: 'Her 10₺ harcaman için 1 puan kazan',
    },
    {
      icon: Award,
      title: 'Puan Biriktir',
      description: 'Puanların hesabında birikir',
    },
    {
      icon: Gift,
      title: 'İndirim Kazan',
      description: 'Puanlarını kullan, indirim kazan',
    },
  ];

  const rewards = [
    {
      points: 500,
      discount: '50₺',
      description: '50₺ İndirim Kuponu',
    },
    {
      points: 1000,
      discount: '120₺',
      description: '120₺ İndirim Kuponu',
    },
    {
      points: 2000,
      discount: '300₺',
      description: '300₺ İndirim Kuponu',
    },
    {
      points: 5000,
      discount: '1000₺',
      description: '1000₺ İndirim Kuponu',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-white)]">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-[var(--primary-coral)] to-[var(--primary-peach)]">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-[var(--brand-black)]" />
            <h1 className="mb-4 text-[var(--brand-black)]">Puan Kazan, İndirim Kazan</h1>
            <p className="text-xl text-[var(--brand-black)]/80 mb-8">
              Her alışverişinizde puan kazanın, puanlarınızı indirim kuponlarına çevirin
            </p>

            {isLoggedIn && (
              <div className="bg-white/90 backdrop-blur rounded-2xl p-8 max-w-md mx-auto">
                <p className="text-sm text-muted-foreground mb-2">Mevcut Puanınız</p>
                <p className="text-5xl font-bold text-[var(--primary-coral)] mb-4">{currentPoints}</p>
                <Button className="bg-[var(--brand-black)] hover:bg-[var(--brand-black)]/90 text-white">
                  Puanlarımı Kullan
                </Button>
              </div>
            )}

            {!isLoggedIn && (
              <Button
                asChild
                size="lg"
                className="bg-[var(--brand-black)] hover:bg-[var(--brand-black)]/90 text-white"
              >
                <a href="/login">Giriş Yap & Puan Kazan</a>
              </Button>
            )}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-12">Nasıl Çalışır?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-[var(--primary-coral)] rounded-full flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-[var(--brand-black)]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-[var(--brand-black)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h4 className="text-xl font-medium mb-2">{step.title}</h4>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewards Catalog */}
      <section className="section-padding bg-[var(--brand-cream)]">
        <div className="container-custom">
          <h2 className="text-center mb-12">Ödül Kataloğu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {rewards.map((reward, index) => (
              <motion.div
                key={reward.points}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 text-center border-2 border-transparent hover:border-[var(--primary-coral)] transition-all"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--primary-peach)] rounded-full mb-4">
                  <Gift className="w-8 h-8 text-[var(--brand-black)]" />
                </div>
                <p className="text-3xl font-bold text-[var(--primary-coral)] mb-2">
                  {reward.points}
                </p>
                <p className="text-sm text-muted-foreground mb-4">Puan</p>
                <p className="text-xl font-semibold mb-2">{reward.discount}</p>
                <p className="text-sm text-muted-foreground mb-4">{reward.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isLoggedIn && currentPoints < reward.points}
                >
                  {isLoggedIn && currentPoints >= reward.points ? 'Kullan' : 'Biriktir'}
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-center mb-12">Puan Kazanmaya Başla</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
