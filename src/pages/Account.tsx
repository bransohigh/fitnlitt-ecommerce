import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Package, MapPin, Heart, ChevronRight, Save, Bell, Lock, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type Section = 'profile' | 'orders' | 'addresses' | 'wishlist' | 'security';

const navItems = [
  { id: 'profile' as Section, label: 'Profilim', icon: User },
  { id: 'orders' as Section, label: 'Siparişlerim', icon: Package, badge: '0' },
  { id: 'addresses' as Section, label: 'Adreslerim', icon: MapPin },
  { id: 'wishlist' as Section, label: 'Favorilerim', icon: Heart },
  { id: 'security' as Section, label: 'Güvenlik', icon: Lock },
];

// ─── Profile Form ─────────────────────────────────────────────────────────────
function ProfileSection() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Coming soon notice */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 flex items-start gap-3">
        <Bell className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-amber-700">
          Hesap sistemi şu anda geliştirme aşamasındadır. Form alanları görseldir; kaydetme henüz backend'e bağlı değildir.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kişisel Bilgiler</CardTitle>
          <CardDescription>Profil bilgilerinizi görüntüleyin ve düzenleyin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-5">
            {/* Avatar */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary-coral)] to-[var(--primary-peach)] flex items-center justify-center text-white text-2xl font-bold select-none">
                K
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Profil Fotoğrafı</p>
                <p className="text-xs text-gray-500 mt-0.5">Yakında eklenecek</p>
              </div>
              <Button type="button" variant="outline" size="sm" className="ml-auto" disabled>
                Fotoğraf Yükle
              </Button>
            </div>

            {/* Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="firstName">Ad</Label>
                <Input id="firstName" placeholder="Adınız" defaultValue="" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName">Soyad</Label>
                <Input id="lastName" placeholder="Soyadınız" defaultValue="" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-posta</Label>
              <Input id="email" type="email" placeholder="ornek@email.com" defaultValue="" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefon</Label>
              <Input id="phone" type="tel" placeholder="+90 5xx xxx xx xx" defaultValue="" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="birthdate">Doğum Tarihi</Label>
              <Input id="birthdate" type="date" defaultValue="" />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <Button type="submit" className="gap-2">
                <Save className="w-4 h-4" />
                Kaydet
              </Button>
              {saved && (
                <span className="text-sm text-green-600 font-medium animate-fade-in">
                  ✓ Kaydedildi (demo)
                </span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Orders Placeholder ───────────────────────────────────────────────────────
function OrdersSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Siparişlerim</CardTitle>
        <CardDescription>Geçmiş ve aktif siparişlerinizi burada görebilirsiniz.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Henüz siparişiniz yok</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            Sipariş geçmişiniz burada görünecek. Sipariş takibi yakında aktif olacak.
          </p>
          <Link to="/">
            <Button variant="outline" size="sm">Alışverişe Başla</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Addresses Placeholder ────────────────────────────────────────────────────
function AddressesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Adreslerim</CardTitle>
        <CardDescription>Kayıtlı teslimat adreslerinizi yönetin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <MapPin className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Kayıtlı adres bulunamadı</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            Adres yönetimi yakında burada aktif olacak.
          </p>
          <Button variant="outline" size="sm" disabled>Adres Ekle (Yakında)</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Wishlist Placeholder ─────────────────────────────────────────────────────
function WishlistSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorilerim</CardTitle>
        <CardDescription>Beğendiğiniz ürünleri kaydedin.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Heart className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 mb-1">Favori listeniz boş</h3>
          <p className="text-sm text-gray-500 max-w-xs mb-6">
            Ürün sayfalarındaki kalp ikonuna tıklayarak favorilerinize ekleyebilirsiniz.
          </p>
          <Link to="/">
            <Button variant="outline" size="sm">Ürünleri Keşfet</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Security Placeholder ─────────────────────────────────────────────────────
function SecuritySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Güvenlik</CardTitle>
        <CardDescription>Şifre ve güvenlik ayarlarınızı yönetin.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
          <p className="text-sm text-amber-700">
            Kimlik doğrulama sistemi geliştirme aşamasındadır.
          </p>
        </div>
        <div className="space-y-3">
          {['Şifre Değiştir', 'İki Faktörlü Doğrulama', 'Oturum Yönetimi'].map(item => (
            <div key={item} className="flex items-center justify-between p-4 rounded-lg border border-gray-100 bg-gray-50/50">
              <span className="text-sm font-medium text-gray-700">{item}</span>
              <Button variant="outline" size="sm" disabled>Yakında</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Account Page ────────────────────────────────────────────────────────
export const Account: React.FC = () => {
  const [activeSection, setActiveSection] = useState<Section>('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <ProfileSection />;
      case 'orders': return <OrdersSection />;
      case 'addresses': return <AddressesSection />;
      case 'wishlist': return <WishlistSection />;
      case 'security': return <SecuritySection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Link to="/" className="hover:text-[var(--primary-coral)] transition-colors">Ana Sayfa</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-800 font-medium">Hesabım</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--primary-coral)] to-[var(--primary-peach)] flex items-center justify-center text-white text-xl font-bold shrink-0">
              K
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hesabım</h1>
              <p className="text-sm text-gray-500 mt-0.5">Hoş geldiniz! Hesap bilgilerinizi yönetin.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-8">
        <div className="flex gap-8 flex-col lg:flex-row">

          {/* ── Left Sidebar ─────────────────────────────── */}
          <aside className="lg:w-64 shrink-0">
            <Card className="overflow-hidden">
              <nav className="py-2">
                {navItems.map((item, idx) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <React.Fragment key={item.id}>
                      {idx > 0 && idx === navItems.length - 1 && (
                        <Separator className="my-2" />
                      )}
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors text-left
                          ${isActive
                            ? 'bg-[var(--primary-coral)]/8 text-[var(--primary-coral)]'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[var(--primary-coral)]' : 'text-gray-400'}`} />
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">{item.badge}</Badge>
                        )}
                        {isActive && <ChevronRight className="w-3.5 h-3.5 text-[var(--primary-coral)]" />}
                      </button>
                    </React.Fragment>
                  );
                })}
              </nav>

              <Separator />

              {/* Sign out */}
              <div className="py-2">
                <button
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors text-left"
                  onClick={() => alert('Çıkış sistemi yakında aktif olacak.')}
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  Çıkış Yap
                </button>
              </div>
            </Card>
          </aside>

          {/* ── Main Panel ───────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};
