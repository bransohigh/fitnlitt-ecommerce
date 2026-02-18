/**
 * FitRecommender
 * Floating wizard to help users find their collection + size in <10 seconds.
 * State is client-side only. Dismissed state persisted in localStorage.
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, Ruler, ArrowLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fetchProducts, APIProduct } from '@/lib/api-client';
import { formatPrice } from '@/lib/utils';
import {
  Answers,
  HeightOption,
  BodyTypeOption,
  GoalOption,
  getRecommendation,
  RecommendationResult,
} from './recommender-engine';

// ─── Step definitions ──────────────────────────────────────────────────────────

const STEPS = [
  {
    id: 'height',
    question: 'Boyun hangisine daha yakın?',
    options: [
      { value: '155-'    as HeightOption, label: '155 cm ve altı' },
      { value: '156-168' as HeightOption, label: '156 – 168 cm' },
      { value: '169-178' as HeightOption, label: '169 – 178 cm' },
      { value: '179+'    as HeightOption, label: '179 cm ve üzeri' },
    ],
  },
  {
    id: 'bodyType',
    question: 'Vücut tipini en yakın seç',
    options: [
      { value: 'ince'   as BodyTypeOption, label: 'İnce', emoji: '🌿' },
      { value: 'fit'    as BodyTypeOption, label: 'Fit',  emoji: '💪' },
      { value: 'basen'  as BodyTypeOption, label: 'Basen belirgin', emoji: '✨' },
      { value: 'karin'  as BodyTypeOption, label: 'Karın bölgesi belirgin', emoji: '🌸' },
    ],
  },
  {
    id: 'goal',
    question: 'Nasıl kullanacaksın?',
    options: [
      { value: 'gunluk'       as GoalOption, label: 'Günlük rahat kullanım', emoji: '☕' },
      { value: 'spor'         as GoalOption, label: 'Spor & hareket',        emoji: '🏃‍♀️' },
      { value: 'toparlayici'  as GoalOption, label: 'Toparlayıcı etki',      emoji: '🔥' },
    ],
  },
] as const;

const COLLECTION_META: Record<string, { label: string; description: string; color: string }> = {
  'she-moves':  { label: 'She Moves',  description: 'Hareket ile tasarlanan spor serisi', color: 'bg-[var(--primary-coral)]' },
  '2nd-skn':    { label: '2nd Skin',   description: 'İkinci ten etkisi — toparlayıcı & şekillendirici', color: 'bg-[var(--brand-black)]' },
  'everyday':   { label: 'Everyday',   description: 'Her gün giyilebilir rahat kesimler', color: 'bg-[#7c8f6e]' },
};

// ─── Result product mini card ─────────────────────────────────────────────────

function ResultProductCard({ product }: { product: APIProduct }) {
  const hasDiscount = product.compare_at && product.compare_at > product.price;
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl bg-[var(--brand-cream)] aspect-[3/4] shadow-sm group-hover:shadow-md transition-shadow duration-300">
        {product.primaryImage?.url ? (
          <img
            src={product.primaryImage.url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-gray-200">✦</div>
        )}
      </div>
      <p className="mt-2 text-xs font-medium text-[var(--brand-black)] line-clamp-2 group-hover:text-[var(--primary-coral)] transition-colors">
        {product.title}
      </p>
      <div className="flex items-baseline gap-1.5 mt-0.5">
        <span className="text-sm font-bold text-[var(--brand-black)]">{formatPrice(product.price)}₺</span>
        {hasDiscount && (
          <span className="text-xs text-gray-400 line-through">{formatPrice(product.compare_at!)}₺</span>
        )}
      </div>
    </Link>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

const LS_DISMISSED = 'fit_recommender_dismissed';

export function FitRecommender() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);             // 0-indexed, 0–2 = wizard, 3 = result
  const [answers, setAnswers] = useState<Answers>({ height: null, bodyType: null, goal: null });
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [resultProducts, setResultProducts] = useState<APIProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Auto-show tooltip after 3 s (once, unless dismissed)
  useEffect(() => {
    if (localStorage.getItem(LS_DISMISSED) === '1') { setIsDismissed(true); return; }
    const t = setTimeout(() => setShowTooltip(true), 3000);
    const t2 = setTimeout(() => setShowTooltip(false), 8000);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  function openWizard() {
    setShowTooltip(false);
    setStep(0);
    setAnswers({ height: null, bodyType: null, goal: null });
    setResult(null);
    setResultProducts([]);
    setOpen(true);
  }

  function close() {
    setOpen(false);
  }

  function dismiss() {
    localStorage.setItem(LS_DISMISSED, '1');
    setIsDismissed(true);
    setOpen(false);
  }

  function back() {
    if (step > 0) setStep((s) => s - 1);
  }

  async function selectOption(field: keyof Answers, value: string) {
    const newAnswers: Answers = { ...answers, [field]: value };
    setAnswers(newAnswers);

    if (step < 2) {
      setStep((s) => s + 1);
    } else {
      // Final step — compute result
      const rec = getRecommendation(newAnswers);
      setResult(rec);
      setStep(3);

      if (rec) {
        setLoadingProducts(true);
        try {
          const { items } = await fetchProducts({ collection: rec.collectionSlug, limit: 3, sort: 'recommended' });
          setResultProducts(items);
        } catch {
          // silent fail
        } finally {
          setLoadingProducts(false);
        }
      }
    }
  }

  if (isDismissed) return null;

  const currentStep = STEPS[step];

  return (
    <>
      {/* ── Floating button ──────────────────────────────────────────────── */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
        {/* Tooltip */}
        {showTooltip && !open && (
          <div className="bg-[var(--brand-black)] text-white text-xs font-medium rounded-xl px-4 py-2.5 shadow-xl max-w-[180px] leading-snug animate-in fade-in slide-in-from-bottom-2 duration-300">
            Senin için doğru modeli bulalım ✨
            <div className="absolute -bottom-1.5 left-5 w-3 h-3 bg-[var(--brand-black)] rotate-45" />
          </div>
        )}
        <button
          onClick={openWizard}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          aria-label="Senin için doğru modeli bulalım"
          className="group w-14 h-14 rounded-full bg-[var(--brand-black)] text-white shadow-2xl flex items-center justify-center hover:bg-[var(--primary-coral)] hover:scale-110 active:scale-95 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--primary-coral)]"
        >
          <Ruler className="w-6 h-6" />
        </button>
      </div>

      {/* ── Modal backdrop + panel ────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Fit Recommender"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={close}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-md mx-auto bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300 overflow-hidden max-h-[92vh] flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary-coral)]" />
                <span className="text-sm font-bold text-[var(--brand-black)] tracking-wide uppercase">
                  Fit Rehberi
                </span>
              </div>
              <div className="flex items-center gap-2">
                {step > 0 && step < 3 && (
                  <button
                    onClick={back}
                    className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                    aria-label="Geri"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={close}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                  aria-label="Kapat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Progress bar (wizard steps only) */}
            {step < 3 && (
              <div className="px-6 pt-4 flex-shrink-0">
                <div className="flex items-center gap-1 mb-1">
                  {STEPS.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                        i <= step ? 'bg-[var(--primary-coral)]' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-gray-400 text-right">{step + 1} / {STEPS.length}</p>
              </div>
            )}

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto">

              {/* ── Wizard steps ────────────────────────────────────────── */}
              {step < 3 && currentStep && (
                <div className="px-6 py-6">
                  <h2 className="text-xl font-bold text-[var(--brand-black)] mb-6 leading-snug">
                    {currentStep.question}
                  </h2>
                  <div className="space-y-3">
                    {currentStep.options.map((opt) => {
                      const field = currentStep.id as keyof Answers;
                      const isSelected = answers[field] === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => selectOption(field, opt.value)}
                          className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-coral)] ${
                            isSelected
                              ? 'border-[var(--primary-coral)] bg-[var(--primary-coral)]/10 text-[var(--brand-black)]'
                              : 'border-gray-200 hover:border-gray-400 bg-white text-[var(--brand-black)]'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            {'emoji' in opt && (
                              <span className="text-lg leading-none">{(opt as any).emoji}</span>
                            )}
                            <span className="text-sm font-medium">{opt.label}</span>
                          </span>
                          {isSelected
                            ? <CheckCircle2 className="w-4 h-4 text-[var(--primary-coral)] flex-shrink-0" />
                            : <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                          }
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Result screen ─────────────────────────────────────────── */}
              {step === 3 && result && (
                <div className="px-6 py-6 space-y-6">
                  {/* Title */}
                  <div className="text-center">
                    <p className="text-[10px] font-bold tracking-widest uppercase text-[var(--primary-coral)] mb-1">Sana en uygun seri</p>
                    <h2 className="text-2xl font-bold text-[var(--brand-black)]">
                      {COLLECTION_META[result.collectionSlug]?.label ?? result.collectionLabel}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {COLLECTION_META[result.collectionSlug]?.description}
                    </p>
                  </div>

                  {/* Size badge */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-16 h-16 rounded-2xl bg-[var(--brand-black)] text-white flex items-center justify-center text-2xl font-bold shadow-lg">
                        {result.size}
                      </div>
                      <p className="text-[10px] text-gray-500 text-center max-w-[120px] leading-snug">
                        {result.sizeReason}
                      </p>
                    </div>
                  </div>

                  {/* Product cards */}
                  {loadingProducts ? (
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="space-y-2 animate-pulse">
                          <div className="aspect-[3/4] bg-gray-100 rounded-xl" />
                          <div className="h-3 bg-gray-100 rounded w-3/4" />
                          <div className="h-3 bg-gray-100 rounded w-1/2" />
                        </div>
                      ))}
                    </div>
                  ) : resultProducts.length > 0 ? (
                    <div className="grid grid-cols-3 gap-3">
                      {resultProducts.map((p) => (
                        <ResultProductCard key={p.id} product={p} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 text-center py-4">Ürünler yükleniyor…</p>
                  )}

                  {/* CTA */}
                  <Button
                    asChild
                    className="w-full bg-[var(--brand-black)] hover:bg-[var(--primary-coral)] text-white hover:text-[var(--brand-black)] h-12 font-semibold text-sm"
                  >
                    <Link to={`/collection/${result.collectionSlug}`} onClick={close}>
                      Bu ürünleri incele
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>

                  {/* Restart */}
                  <button
                    onClick={() => { setStep(0); setAnswers({ height: null, bodyType: null, goal: null }); }}
                    className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
                  >
                    Baştan başla
                  </button>
                </div>
              )}
            </div>

            {/* Footer — dismiss forever */}
            <div className="px-6 pb-5 pt-2 flex-shrink-0 border-t border-gray-100">
              <button
                onClick={dismiss}
                className="w-full text-[11px] text-gray-400 hover:text-gray-600 transition-colors"
              >
                Tekrar gösterme
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
