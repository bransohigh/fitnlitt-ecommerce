import React, { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Package, Truck, RotateCcw, HelpCircle } from 'lucide-react';

interface ProductDetailsProps {
  description: string;
  fabric: string;
  care: string;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  description,
  fabric,
  care,
}) => {
  return (
    <div className="border-t pt-8 mt-12">
      <Accordion type="single" collapsible defaultValue="description" className="w-full">
        {/* Ürün Açıklaması */}
        <AccordionItem value="description">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[var(--primary-coral)]" />
              <span>Ürün Açıklaması</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="prose prose-sm max-w-none text-gray-600 pl-8">
              <p>{description}</p>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Kumaş & Bakım */}
        <AccordionItem value="fabric">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-3">
              <Package className="w-5 h-5 text-[var(--primary-coral)]" />
              <span>Kumaş & Bakım</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-8">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-900">Kumaş Bilgisi</h4>
                <p className="text-sm text-gray-600">{fabric}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-900">Bakım Talimatları</h4>
                <p className="text-sm text-gray-600">{care}</p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Kargo & İade */}
        <AccordionItem value="shipping">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-[var(--primary-coral)]" />
              <span>Kargo & İade</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-8">
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-900">Kargo Bilgileri</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Ücretsiz kargo (tüm siparişler)</li>
                  <li>Aynı gün kargo: Saat 15:00'e kadar verilen siparişler</li>
                  <li>Teslimat süresi: 1-3 iş günü</li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-2 text-gray-900">İade Koşulları</h4>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>14 gün içinde koşulsuz iade</li>
                  <li>Ücretsiz iade kargo</li>
                  <li>Ürün kullanılmamış ve etiketli olmalı</li>
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SSS */}
        <AccordionItem value="faq">
          <AccordionTrigger className="text-left">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-[var(--primary-coral)]" />
              <span>Sık Sorulan Sorular</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pl-8">
              <div>
                <h4 className="text-sm font-semibold mb-1 text-gray-900">
                  Ürün bedenime uygun mu?
                </h4>
                <p className="text-sm text-gray-600">
                  Beden rehberimizi kullanarak ölçülerinize en uygun bedeni seçebilirsiniz.
                  Sorularınız için müşteri hizmetlerimizle iletişime geçebilirsiniz.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1 text-gray-900">
                  Ürün ne zaman elime ulaşır?
                </h4>
                <p className="text-sm text-gray-600">
                  Saat 15:00'e kadar verilen siparişler aynı gün kargoya verilir. Teslimat süresi 1-3 iş günüdür.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-1 text-gray-900">
                  İade işlemi nasıl yapılır?
                </h4>
                <p className="text-sm text-gray-600">
                  Hesabınızdan "Siparişlerim" bölümünden iade talebi oluşturabilirsiniz.
                  Kargo ücreti tarafımızdan karşılanır.
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};