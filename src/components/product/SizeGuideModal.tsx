import React from 'react';
import { X, Ruler } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
}

const sizeData = {
  tops: [
    { size: 'XS', bust: '80-84', waist: '60-64', hips: '86-90' },
    { size: 'S', bust: '84-88', waist: '64-68', hips: '90-94' },
    { size: 'M', bust: '88-92', waist: '68-72', hips: '94-98' },
    { size: 'L', bust: '92-96', waist: '72-76', hips: '98-102' },
    { size: 'XL', bust: '96-100', waist: '76-80', hips: '102-106' },
    { size: 'XXL', bust: '100-106', waist: '80-86', hips: '106-112' },
  ],
  bottoms: [
    { size: 'XS', waist: '60-64', hips: '86-90', inseam: '75' },
    { size: 'S', waist: '64-68', hips: '90-94', inseam: '76' },
    { size: 'M', waist: '68-72', hips: '94-98', inseam: '77' },
    { size: 'L', waist: '72-76', hips: '98-102', inseam: '78' },
    { size: 'XL', waist: '76-80', hips: '102-106', inseam: '79' },
    { size: 'XXL', waist: '80-86', hips: '106-112', inseam: '80' },
  ],
};

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 gap-0">
        <DialogTitle className="sr-only">Beden Rehberi</DialogTitle>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
          aria-label="Kapat"
        >
          <X className="w-5 h-5 text-[var(--brand-black)]" />
        </button>

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[var(--primary-coral)] rounded-lg">
              <Ruler className="w-6 h-6 text-[var(--brand-black)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--brand-black)]">Beden Rehberi</h2>
              <p className="text-sm text-muted-foreground">Tüm ölçüler santimetre cinsindendir</p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="tops" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="tops">Üst Giyim</TabsTrigger>
              <TabsTrigger value="bottoms">Alt Giyim</TabsTrigger>
            </TabsList>

            {/* Tops Table */}
            <TabsContent value="tops" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--brand-cream)]">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        Beden
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        Göğüs (cm)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        Bel (cm)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        Kalça (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.tops.map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[var(--brand-black)] border">
                          {row.size}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border">{row.bust}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border">{row.waist}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border">{row.hips}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measurement Guide */}
              <div className="bg-[var(--brand-cream)] rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-[var(--brand-black)] mb-3">Nasıl Ölçülür?</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Göğüs:</span> Ölçü şeridini göğsünüzün en geniş noktasından
                    geçirerek vücudunuzun etrafında yatay olarak ölçün.
                  </p>
                  <p>
                    <span className="font-medium">Bel:</span> Ölçü şeridini doğal bel hattınızdan (genellikle
                    göbeğinizin üstünden) geçirerek ölçün.
                  </p>
                  <p>
                    <span className="font-medium">Kalça:</span> Ölçü şeridini kalçalarınızın en geniş noktasından
                    geçirerek yatay olarak ölçün.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Bottoms Table */}
            <TabsContent value="bottoms" className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[var(--brand-cream)]">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        Beden
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        Bel (cm)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        Kalça (cm)
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-[var(--brand-black)] border">
                        İç Bacak (cm)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.bottoms.map((row) => (
                      <tr key={row.size} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-[var(--brand-black)] border">
                          {row.size}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 border">{row.waist}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border">{row.hips}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 border">{row.inseam}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Measurement Guide */}
              <div className="bg-[var(--brand-cream)] rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-[var(--brand-black)] mb-3">Nasıl Ölçülür?</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium">Bel:</span> Ölçü şeridini doğal bel hattınızdan (genellikle
                    göbeğinizin üstünden) geçirerek ölçün.
                  </p>
                  <p>
                    <span className="font-medium">Kalça:</span> Ölçü şeridini kalçalarınızın en geniş noktasından
                    geçirerek yatay olarak ölçün.
                  </p>
                  <p>
                    <span className="font-medium">İç Bacak:</span> Kasık bölgesinden ayak bileğinize kadar olan
                    mesafeyi ölçün.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Ölçüleriniz iki beden arasındaysa, daha büyük bedeni seçmenizi öneririz.
            </p>
            <Button variant="outline" asChild className="gap-2">
              <a href="/contact">
                <span>Destek Alın</span>
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
