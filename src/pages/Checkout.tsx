import React, { useState } from 'react';
import { Check, CreditCard, Lock } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

type CheckoutStep = 'delivery' | 'payment' | 'confirmation';

export const Checkout: React.FC = () => {
  const [step, setStep] = useState<CheckoutStep>('delivery');
  const [orderNumber] = useState(`ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const { items, subtotal } = useCart();

  const steps = [
    { id: 'delivery', label: 'Teslimat Bilgileri', number: 1 },
    { id: 'payment', label: 'Ödeme Bilgisi', number: 2 },
    { id: 'confirmation', label: 'Onay', number: 3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);
  const shippingCost = subtotal >= 500 ? 0 : 50;
  const total = subtotal + shippingCost;

  return (
    <div className="min-h-screen bg-[var(--brand-cream)]">
      <div className="container-custom py-12">
        {/* Progress Stepper */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {steps.map((s, index) => (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                      currentStepIndex > index
                        ? 'bg-[var(--success-green)] text-white'
                        : currentStepIndex === index
                        ? 'bg-[var(--primary-coral)] text-[var(--brand-black)]'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {currentStepIndex > index ? <Check className="w-5 h-5" /> : s.number}
                  </div>
                  <span className="text-xs mt-2 text-center max-w-[100px]">{s.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-4 transition-all ${
                      currentStepIndex > index ? 'bg-[var(--success-green)]' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              {step === 'delivery' && <DeliveryForm onNext={() => setStep('payment')} />}
              {step === 'payment' && (
                <PaymentForm onNext={() => setStep('confirmation')} onBack={() => setStep('delivery')} />
              )}
              {step === 'confirmation' && <ConfirmationStep orderNumber={orderNumber} />}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-medium mb-4">Sipariş Özeti</h3>

              {/* Products */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-[var(--brand-cream)] shrink-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.selectedSize} | {item.selectedColor} | {item.quantity} adet
                      </p>
                      <p className="text-sm font-semibold mt-1">
                        {item.product.price * item.quantity}₺
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="space-y-3 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ara Toplam</span>
                  <span className="font-medium">{subtotal}₺</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Kargo</span>
                  <span className={`font-medium ${shippingCost === 0 ? 'text-[var(--success-green)]' : ''}`}>
                    {shippingCost === 0 ? 'Ücretsiz' : `${shippingCost}₺`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-semibold pt-4 border-t mt-4">
                <span>Toplam</span>
                <span>{total}₺</span>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
                <Shield className="w-4 h-4 text-[var(--success-green)]" />
                <span>256-bit SSL şifreli güvenli ödeme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliveryForm: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [sameAddress, setSameAddress] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-6">Teslimat Bilgileri</h2>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="ornek@email.com" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Ad</Label>
              <Input id="firstName" type="text" required />
            </div>
            <div>
              <Label htmlFor="lastName">Soyad</Label>
              <Input id="lastName" type="text" required />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Telefon</Label>
            <Input id="phone" type="tel" placeholder="0532 123 45 67" required />
          </div>

          <div>
            <Label htmlFor="address">Adres</Label>
            <Input id="address" type="text" placeholder="Mahalle, Sokak, No" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Şehir</Label>
              <Input id="city" type="text" required />
            </div>
            <div>
              <Label htmlFor="postal">Posta Kodu</Label>
              <Input id="postal" type="text" required />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAddress"
              checked={sameAddress}
              onCheckedChange={(checked) => setSameAddress(checked as boolean)}
            />
            <label htmlFor="sameAddress" className="text-sm cursor-pointer">
              Fatura adresi teslimat adresi ile aynı
            </label>
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] py-6 text-lg">
        Devam Et
      </Button>
    </form>
  );
};

const PaymentForm: React.FC<{ onNext: () => void; onBack: () => void }> = ({ onNext, onBack }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-medium mb-6">Ödeme Bilgileri</h2>

        <div className="bg-[var(--brand-cream)] p-6 rounded-lg mb-6">
          <div className="flex items-center gap-3 mb-4">
            <CreditCard className="w-6 h-6" />
            <span className="font-medium">Kredi Kartı ile Öde</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="w-4 h-4" />
            <span>iyzico güvenli ödeme altyapısı</span>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-900">
          <p className="font-medium mb-2">Demo Uyarısı</p>
          <p>Bu bir demo sayfasıdır. Gerçek ödeme işlemi yapılmamaktadır.</p>
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="button" onClick={onBack} variant="outline" className="flex-1">
          Geri
        </Button>
        <Button type="submit" className="flex-1 bg-[var(--success-green)] hover:bg-[var(--success-green)]/90 text-white">
          Siparişi Tamamla
        </Button>
      </div>
    </form>
  );
};

const ConfirmationStep: React.FC<{ orderNumber: string }> = ({ orderNumber }) => {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--success-green)] rounded-full mb-6">
        <Check className="w-10 h-10 text-white" />
      </div>
      
      <h2 className="text-3xl font-medium mb-4">Siparişiniz Alındı!</h2>
      <p className="text-lg text-muted-foreground mb-8">
        Sipariş numaranız: <span className="font-semibold text-[var(--brand-black)]">{orderNumber}</span>
      </p>
      
      <p className="text-base text-muted-foreground mb-8">
        Sipariş detaylarını email adresinize gönderdik.
      </p>

      <Button
        asChild
        size="lg"
        className="bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)]"
      >
        <a href="/">Ana Sayfaya Dön</a>
      </Button>
    </div>
  );
};
