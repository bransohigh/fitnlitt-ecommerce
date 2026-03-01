import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShipmentEvent {
  date: string;
  description: string;
  location?: string;
}

interface Shipment {
  id: string;
  tracking_number: string;
  order_id?: string;
  status: string;
  carrier: string;
  customer_name?: string;
  estimated_delivery?: string;
  events: ShipmentEvent[];
  created_at: string;
  updated_at: string;
}

const STATUS_STEPS = [
  { key: 'Hazırlanıyor', label: 'Sipariş Hazırlanıyor', icon: Clock },
  { key: 'Kargoya Verildi', label: 'Kargoya Verildi', icon: Package },
  { key: 'Dağıtımda', label: 'Dağıtımda', icon: Truck },
  { key: 'Teslim Edildi', label: 'Teslim Edildi', icon: CheckCircle2 },
];

function getStepIndex(status: string): number {
  const idx = STATUS_STEPS.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

export const CargoTracking: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError(null);
    setShipment(null);
    setSearched(true);

    try {
      const res = await fetch(`/api/cargo/${encodeURIComponent(trackingNumber.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Kargo bilgisi bulunamadı.');
      } else {
        setShipment(json.data || json);
      }
    } catch {
      setError('Sunucuya bağlanırken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const activeStep = shipment ? getStepIndex(shipment.status) : -1;

  return (
    <div className="min-h-screen bg-[var(--brand-white)]">
      {/* Hero */}
      <div className="bg-gradient-to-r from-[var(--primary-peach)] to-[var(--primary-coral)] py-16">
        <div className="container-custom text-center">
          <Truck className="w-12 h-12 mx-auto mb-4 text-[var(--brand-black)]/70" />
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--brand-black)] mb-3">
            Kargo Takip
          </h1>
          <p className="text-[var(--brand-black)]/70 text-base md:text-lg max-w-xl mx-auto">
            Sipariş takip numaranı girerek kargonum nerede öğren.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="container-custom py-12 max-w-2xl">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="Sipariş veya kargo no (örn. FNL-2026-0001)"
            className="flex-1 h-12 text-base border-2 focus:border-[var(--primary-coral)]"
            autoFocus
          />
          <Button
            type="submit"
            disabled={loading || !trackingNumber.trim()}
            className="h-12 px-6 bg-[var(--primary-coral)] hover:bg-[var(--primary-peach)] text-[var(--brand-black)] font-semibold gap-2"
          >
            <Search className="w-4 h-4" />
            {loading ? 'Aranıyor…' : 'Sorgula'}
          </Button>
        </form>

        {/* Error State */}
        {searched && !loading && error && (
          <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold">Kargo bulunamadı</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Shipment found */}
        {shipment && !loading && (
          <div className="mt-8 space-y-6">
            {/* Status card */}
            <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="bg-gradient-to-r from-[var(--primary-peach)]/30 to-[var(--primary-coral)]/20 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Takip Numarası</p>
                    <p className="text-lg font-bold text-[var(--brand-black)]">{shipment.tracking_number}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-[var(--primary-coral)] text-[var(--brand-black)]">
                    {shipment.status}
                  </span>
                </div>
                {shipment.carrier && (
                  <p className="text-sm text-gray-600 mt-2">Kargo Firması: <span className="font-medium text-[var(--brand-black)]">{shipment.carrier}</span></p>
                )}
                {shipment.estimated_delivery && (
                  <p className="text-sm text-gray-600 mt-1">
                    Tahmini Teslimat: <span className="font-medium text-[var(--brand-black)]">{new Date(shipment.estimated_delivery).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </p>
                )}
              </div>

              {/* Progress steps */}
              <div className="px-6 py-6">
                <div className="flex items-start justify-between relative">
                  {/* Connector line */}
                  <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 mx-8" />
                  <div
                    className="absolute top-5 left-0 h-0.5 bg-[var(--primary-coral)] mx-8 transition-all duration-700"
                    style={{ width: `${activeStep > 0 ? (activeStep / (STATUS_STEPS.length - 1)) * 100 : 0}%` }}
                  />

                  {STATUS_STEPS.map((step, i) => {
                    const Icon = step.icon;
                    const done = i <= activeStep;
                    return (
                      <div key={step.key} className="relative flex flex-col items-center flex-1 gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 transition-colors
                            ${done
                              ? 'bg-[var(--primary-coral)] border-[var(--primary-coral)] text-[var(--brand-black)]'
                              : 'bg-white border-gray-300 text-gray-400'}`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className={`text-xs text-center leading-tight max-w-[70px] ${done ? 'text-[var(--brand-black)] font-medium' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Events timeline */}
            {Array.isArray(shipment.events) && shipment.events.length > 0 && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-[var(--brand-black)]">Kargo Hareketleri</h2>
                </div>
                <ul className="divide-y divide-gray-100">
                  {(shipment.events as ShipmentEvent[]).slice().reverse().map((ev, i) => (
                    <li key={i} className="px-6 py-4 flex items-start gap-4">
                      <div className="w-2 h-2 rounded-full bg-[var(--primary-coral)] mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--brand-black)]">{ev.description}</p>
                        {ev.location && <p className="text-xs text-gray-500 mt-0.5">{ev.location}</p>}
                      </div>
                      <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                        {new Date(ev.date).toLocaleString('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Help text */}
        {!searched && (
          <div className="mt-8 p-5 rounded-2xl bg-gray-50 border border-gray-100">
            <h3 className="font-semibold text-[var(--brand-black)] mb-2">Takip numaranı nereden bulabilirsin?</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>• Siparişin onay e-postasını kontrol et</li>
              <li>• Hesabım → Siparişlerim bölümünden ulaşabilirsin</li>
              <li>• Kargo firmasının gönderdiği SMS'e bak</li>
              <li>• Yardım için <a href="/contact" className="text-[var(--primary-coral)] hover:underline font-medium">bize ulaş</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
