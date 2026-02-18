import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Shield, Truck, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  return (
    <footer className="bg-[var(--brand-black)] text-[var(--brand-white)] pt-16 pb-8">
      <div className="container-custom">
        {/* Newsletter Section */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-medium mb-4">%10 İndirim Kuponunu Kaçırma</h3>
          <p className="text-sm text-gray-400 mb-6">
            Yeni ürünler, özel kampanyalar ve daha fazlası için abone ol
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-2 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Email adresiniz"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
            <Button
              type="submit"
              className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] whitespace-nowrap"
            >
              Abone Ol
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Koleksiyonlar */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Koleksiyonlar</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/collection/she-moves" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">She Moves</Link></li>
              <li><Link to="/collection/latex-korse" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Latex Korse</Link></li>
              <li><Link to="/collection/juicy-collection" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Juicy Collection</Link></li>
              <li><Link to="/collection/baddie-collection" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Baddie Collection</Link></li>
              <li><Link to="/collection/2nd-skn" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">2nd SKN</Link></li>
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Müşteri Hizmetleri</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">İletişim</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">İade ve Değişim</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Kargo Bilgileri</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Sıkça Sorulan Sorular</Link></li>
            </ul>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Hakkımızda</Link></li>
              <li><Link to="/loyalty" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Loyalty Program</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Gizlilik Politikası</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-[var(--primary-coral)] transition-colors">Kullanım Koşulları</Link></li>
            </ul>
          </div>

          {/* Sosyal */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Bizi Takip Edin</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://instagram.com/fitnlitt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-[var(--primary-coral)] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@fitnlitt.com"
                  className="flex items-center gap-2 text-gray-400 hover:text-[var(--primary-coral)] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@fitnlitt.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-8 py-8 border-t border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <Shield className="w-5 h-5 text-[var(--success-green)]" />
            <span className="text-gray-400">iyzico Güvenli Ödeme</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Truck className="w-5 h-5 text-[var(--success-green)]" />
            <span className="text-gray-400">Ücretsiz Kargo 500₺+</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <RotateCcw className="w-5 h-5 text-[var(--success-green)]" />
            <span className="text-gray-400">14 Gün İade Garantisi</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-sm text-gray-400">
            © 2025 Fitnlitt. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
};
