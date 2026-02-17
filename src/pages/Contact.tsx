import React, { useState } from 'react';
import { Mail, Instagram, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Mesajınız gönderildi! En kısa sürede dönüş yapacağız.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const faqs = [
    {
      question: 'Kargo süresi ne kadar?',
      answer: 'Siparişler 1-3 iş günü içinde kargoya verilir. Teslimat süresi bölgenize göre 2-5 iş günü arasında değişmektedir.',
    },
    {
      question: 'İade koşulları nelerdir?',
      answer: 'Ürünlerinizi teslim aldıktan sonra 14 gün içinde iade edebilirsiniz. Ürünlerin kullanılmamış ve etiketli olması gerekmektedir.',
    },
    {
      question: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
      answer: 'Kredi kartı, banka kartı ve havale ile ödeme yapabilirsiniz. Tüm ödemeler iyzico güvenli ödeme altyapısı ile işlenmektedir.',
    },
    {
      question: 'Ürünlerin bedenleri nasıl?',
      answer: 'Ürünlerimiz standart bedenlerde üretilmektedir. Detaylı beden tablosunu her ürün sayfasında bulabilirsiniz.',
    },
    {
      question: 'Yurtdışı kargo yapıyor musunuz?',
      answer: 'Şu anda sadece Türkiye içi gönderim yapıyoruz. Yurtdışı kargo için info@fitnlitt.com adresinden bize ulaşabilirsiniz.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--brand-white)]">
      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="mb-4">İletişim</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sorularınız mı var? Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Form */}
            <div className="bg-[var(--brand-cream)] rounded-xl p-8">
              <h3 className="text-2xl font-medium mb-6">Bize Yazın</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Ad Soyad</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Konu</Label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mesajınız</Label>
                  <Textarea
                    id="message"
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] py-6"
                >
                  Gönder
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-medium mb-6">İletişim Bilgileri</h3>
                <div className="space-y-4">
                  <a
                    href="mailto:info@fitnlitt.com"
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--brand-cream)] transition-colors"
                  >
                    <div className="w-12 h-12 bg-[var(--primary-coral)] rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6 text-[var(--brand-black)]" />
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">info@fitnlitt.com</p>
                    </div>
                  </a>

                  <a
                    href="https://instagram.com/fitnlitt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-[var(--brand-cream)] transition-colors"
                  >
                    <div className="w-12 h-12 bg-[var(--primary-coral)] rounded-full flex items-center justify-center shrink-0">
                      <Instagram className="w-6 h-6 text-[var(--brand-black)]" />
                    </div>
                    <div>
                      <p className="font-medium">Instagram</p>
                      <p className="text-sm text-muted-foreground">@fitnlitt</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4">
                    <div className="w-12 h-12 bg-[var(--primary-coral)] rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6 text-[var(--brand-black)]" />
                    </div>
                    <div>
                      <p className="font-medium">Telefon</p>
                      <p className="text-sm text-muted-foreground">0850 xxx xx xx</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[var(--primary-peach)] rounded-xl p-6">
                <h4 className="text-lg font-medium mb-2">Müşteri Hizmetleri</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Hafta içi 09:00 - 18:00 saatleri arasında hizmetinizdeyiz.
                </p>
                <p className="text-xs text-muted-foreground">
                  Tatil günlerinde mesajlarınıza ilk iş günü dönüş yapıyoruz.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-center mb-12">Sıkça Sorulan Sorular</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
};
