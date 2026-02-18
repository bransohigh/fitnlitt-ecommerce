/**
 * DecisionHelper — "Karar veremedin mi? Sana önerelim"
 * 2-step fit/size recommendation modal. Client-side only, no API.
 */

import { useState } from 'react';
import { X, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────

type FitAnswer    = 'rahat' | 'dengeli' | 'siki';
type DurAnswer    = 'gunBoyu' | 'birkazSaat' | 'sadeceDis';

interface Answers {
  fit: FitAnswer | null;
  duration: DurAnswer | null;
}

interface Recommendation {
  fitLabel: string;
  sizeAdvice: string;   // e.g. "Mevcut bedenin"  |  "Bir üst beden"  |  "Bir alt beden"
  explanation: string;
}

// ─── Logic ────────────────────────────────────────────────────────────────────

function getRecommendation(fit: FitAnswer, dur: DurAnswer): Recommendation {
  if (fit === 'rahat') {
    if (dur === 'gunBoyu') return {
      fitLabel: 'Rahat Kesim',
      sizeAdvice: 'Bir üst beden',
      explanation: 'Gün boyu konfor için bir üst beden tercih et — hareket ederken özgür hissedersin.',
    };
    if (dur === 'birkazSaat') return {
      fitLabel: 'Rahat Kesim',
      sizeAdvice: 'Mevcut bedenin',
      explanation: 'Kısa süreli kullanım için standart beden yeterli, rahat ve doğal bir his verir.',
    };
    return {
      fitLabel: 'Dengeli Fit',
      sizeAdvice: 'Mevcut bedenin',
      explanation: 'Görsel bir etki isterken rahat hissedebilirsin — standart beden dengeli durur.',
    };
  }

  if (fit === 'dengeli') {
    if (dur === 'gunBoyu') return {
      fitLabel: 'Dengeli Fit',
      sizeAdvice: 'Mevcut bedenin',
      explanation: 'Gün boyu hem destek hem konfor dengesi için standart beden idealdir.',
    };
    if (dur === 'birkazSaat') return {
      fitLabel: 'Dengeli Fit',
      sizeAdvice: 'Mevcut bedenin',
      explanation: 'Birkaç saatliğine hem şık hem rahat bir seçim — doğru beden mükemmel oturur.',
    };
    return {
      fitLabel: 'Şekillendirici',
      sizeAdvice: 'Mevcut bedenin',
      explanation: 'Görsel etki için standart bedenin hafif toparlar; kısa kullanımda çok konforlu.',
    };
  }

  // siki
  if (dur === 'gunBoyu') return {
    fitLabel: 'Şekillendirici',
    sizeAdvice: 'Bir üst beden',
    explanation: 'Sıkı fit\'i gün boyu taşımak için bir üst beden al — etki aynı, konforu çok daha iyi.',
  };
  if (dur === 'birkazSaat') return {
    fitLabel: 'Şekillendirici',
    sizeAdvice: 'Mevcut bedenin',
    explanation: 'Birkaç saatliğine sıkı fit mükemmel etki verir — standart beden tam oturur.',
  };
  return {
    fitLabel: 'Şekillendirici',
    sizeAdvice: 'Mevcut bedenin ya da bir alt',
    explanation: 'Sadece görsel etki için biraz daha sıkı durmasını istiyorsan bir alt beden de deneyebilirsin.',
  };
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEP1_OPTIONS: { value: FitAnswer; label: string; emoji: string; hint: string }[] = [
  { value: 'rahat',   label: 'Daha rahat',  emoji: '☁️', hint: 'Hareket özgürlüğü önceliğim' },
  { value: 'dengeli', label: 'Dengeli',     emoji: '⚖️', hint: 'Hem destek hem konfor' },
  { value: 'siki',    label: 'Sıkı',        emoji: '💪', hint: 'Toparlayıcı etki istiyorum' },
];

const STEP2_OPTIONS: { value: DurAnswer; label: string; emoji: string }[] = [
  { value: 'gunBoyu',    label: 'Gün boyu',                   emoji: '🌅' },
  { value: 'birkazSaat', label: 'Birkaç saat',                emoji: '⏱️' },
  { value: 'sadeceDis',  label: 'Sadece dış görünüm için',    emoji: '✨' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface DecisionHelperProps {
  /** Currently selected size (optional — shown in result for context) */
  selectedSize?: string;
}

export function DecisionHelper({ selectedSize }: DecisionHelperProps) {
  const [open, setOpen]   = useState(false);
  const [step, setStep]   = useState<1 | 2 | 'result'>(1);
  const [answers, setAnswers] = useState<Answers>({ fit: null, duration: null });

  function handleOpen() {
    setStep(1);
    setAnswers({ fit: null, duration: null });
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function pickFit(v: FitAnswer) {
    setAnswers((a) => ({ ...a, fit: v }));
    setStep(2);
  }

  function pickDuration(v: DurAnswer) {
    setAnswers((a) => ({ ...a, duration: v }));
    setStep('result');
  }

  function restart() {
    setStep(1);
    setAnswers({ fit: null, duration: null });
  }

  const rec = step === 'result' && answers.fit && answers.duration
    ? getRecommendation(answers.fit, answers.duration)
    : null;

  return (
    <>
      {/* ── Trigger button ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={handleOpen}
        className="w-full text-center text-sm text-gray-400 hover:text-[var(--primary-coral)] transition-colors py-1 flex items-center justify-center gap-1.5 group"
      >
        <Sparkles className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
        Karar veremedin mi? Sana önerelim
      </button>

      {/* ── Modal ───────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Beden ve Fit Önerisi"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={handleClose}
          />

          {/* Panel */}
          <div className="relative w-full sm:max-w-sm bg-white rounded-2xl sm:rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-250 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--primary-coral)]" />
                <span className="text-sm font-bold text-[var(--brand-black)] tracking-wide">
                  Fit Önerisi
                </span>
              </div>
              <button
                onClick={handleClose}
                aria-label="Kapat"
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress dots */}
            {step !== 'result' && (
              <div className="flex justify-center gap-1.5 pt-4 px-5">
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 1 ? 'bg-[var(--primary-coral)]' : 'bg-gray-200'}`} />
                <div className={`h-1.5 w-8 rounded-full transition-colors ${step === 2 ? 'bg-[var(--primary-coral)]' : 'bg-gray-200'}`} />
              </div>
            )}

            {/* Body */}
            <div className="px-5 py-5 space-y-4">

              {/* ── Step 1 ── */}
              {step === 1 && (
                <>
                  <h2 className="text-base font-bold text-[var(--brand-black)]">Nasıl his seversin?</h2>
                  <div className="space-y-2">
                    {STEP1_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => pickFit(opt.value)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-[var(--primary-coral)] hover:bg-[var(--primary-coral)]/5 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-coral)]"
                      >
                        <span className="flex items-center gap-3">
                          <span className="text-lg leading-none">{opt.emoji}</span>
                          <span>
                            <span className="block text-sm font-semibold text-[var(--brand-black)]">{opt.label}</span>
                            <span className="block text-[11px] text-gray-400 mt-0.5">{opt.hint}</span>
                          </span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* ── Step 2 ── */}
              {step === 2 && (
                <>
                  <h2 className="text-base font-bold text-[var(--brand-black)]">Ne kadar süre giyeceksin?</h2>
                  <div className="space-y-2">
                    {STEP2_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => pickDuration(opt.value)}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-200 hover:border-[var(--primary-coral)] hover:bg-[var(--primary-coral)]/5 text-left transition-all duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary-coral)]"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-lg leading-none">{opt.emoji}</span>
                          <span className="text-sm font-semibold text-[var(--brand-black)]">{opt.label}</span>
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1 flex items-center gap-1"
                  >
                    ← Geri
                  </button>
                </>
              )}

              {/* ── Result ── */}
              {step === 'result' && rec && (
                <>
                  <div className="text-center space-y-1 pb-1">
                    <CheckCircle2 className="w-9 h-9 text-[var(--primary-coral)] mx-auto" />
                    <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">Sana önerimiz</p>
                  </div>

                  <div className="rounded-xl bg-[var(--brand-cream)] p-4 space-y-3">
                    {/* Fit type */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Fit tipi</span>
                      <span className="text-sm font-bold text-[var(--brand-black)]">{rec.fitLabel}</span>
                    </div>

                    {/* Size advice */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-medium">Beden</span>
                      <span className="text-sm font-bold text-[var(--brand-black)]">
                        {rec.sizeAdvice}
                        {selectedSize ? ` (${selectedSize})` : ''}
                      </span>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                      <p className="text-xs text-gray-600 leading-relaxed">{rec.explanation}</p>
                    </div>
                  </div>

                  <Button
                    onClick={handleClose}
                    className="w-full bg-[var(--brand-black)] hover:bg-[var(--primary-coral)] text-white hover:text-[var(--brand-black)] h-11 font-semibold text-sm"
                  >
                    Anladım
                  </Button>

                  <button
                    onClick={restart}
                    className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Baştan başla
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
