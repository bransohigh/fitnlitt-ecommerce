/**
 * FeelIndicator — "Nasıl hissettirir?" block
 * Shows compression and comfort bars + usage badges.
 * Hover / tap on either bar reveals an explanation card.
 */

import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { getFeelProfile, getCompressionCopy, getComfortCopy } from './feel-indicators';

const MAX = 7;

// ─── Segment bar ──────────────────────────────────────────────────────────────

interface BarProps {
  value: number;       // 1-7
  color: string;       // Tailwind bg class for filled segments
}

function SegmentBar({ value, color }: BarProps) {
  return (
    <div className="flex gap-1" aria-hidden>
      {Array.from({ length: MAX }).map((_, i) => (
        <div
          key={i}
          className={`h-2.5 flex-1 rounded-sm transition-colors duration-300 ${
            i < value ? color : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Explanation popover ──────────────────────────────────────────────────────

interface ExplainerProps {
  text: string;
  label: string;
  onClose: () => void;
}

function Explainer({ text, label, onClose }: ExplainerProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function keyHandler(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="tooltip"
      className="mt-2 px-4 py-3 bg-[var(--brand-black)] text-white rounded-xl text-xs leading-relaxed shadow-xl animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <span className="font-semibold text-[var(--primary-coral)]">{label}: </span>
      {text}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

interface FeelIndicatorProps {
  /** Product slug — used to look up the feel profile */
  slug: string;
  className?: string;
}

export function FeelIndicator({ slug, className = '' }: FeelIndicatorProps) {
  const profile = getFeelProfile(slug);
  const compressionCopy = getCompressionCopy(profile.compressionLevel);
  const comfortCopy     = getComfortCopy(profile.comfortLevel);

  const [openBar, setOpenBar] = useState<'compression' | 'comfort' | null>(null);

  function toggle(bar: 'compression' | 'comfort') {
    setOpenBar((prev) => (prev === bar ? null : bar));
  }

  return (
    <div className={`rounded-2xl border border-gray-100 bg-[var(--brand-cream)]/50 p-5 space-y-4 ${className}`}>
      {/* Title */}
      <p className="text-sm font-bold text-[var(--brand-black)] tracking-wide flex items-center gap-1.5">
        Nasıl hissettirir?
      </p>

      {/* ── Toparlanıcı Etki ── */}
      <div>
        <button
          type="button"
          onClick={() => toggle('compression')}
          className="w-full group focus-visible:outline-none"
          aria-expanded={openBar === 'compression'}
          aria-label="Toparlayıcı etki açıklamasını göster"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700 group-hover:text-[var(--brand-black)] transition-colors">
              Toparlayıcı Etki
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400 font-medium">{compressionCopy.label}</span>
              <Info className="w-3 h-3 text-gray-400 group-hover:text-[var(--primary-coral)] transition-colors" />
            </div>
          </div>
          <SegmentBar value={profile.compressionLevel} color="bg-[var(--brand-black)]" />
          {/* Screen reader value */}
          <span className="sr-only">
            {profile.compressionLevel} / {MAX} — {compressionCopy.description}
          </span>
        </button>

        {openBar === 'compression' && (
          <Explainer
            label={compressionCopy.label}
            text={compressionCopy.description}
            onClose={() => setOpenBar(null)}
          />
        )}
      </div>

      {/* ── Rahatlık ── */}
      <div>
        <button
          type="button"
          onClick={() => toggle('comfort')}
          className="w-full group focus-visible:outline-none"
          aria-expanded={openBar === 'comfort'}
          aria-label="Rahatlık açıklamasını göster"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700 group-hover:text-[var(--brand-black)] transition-colors">
              Rahatlık
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400 font-medium">{comfortCopy.label}</span>
              <Info className="w-3 h-3 text-gray-400 group-hover:text-[var(--primary-coral)] transition-colors" />
            </div>
          </div>
          <SegmentBar value={profile.comfortLevel} color="bg-[var(--primary-coral)]" />
          <span className="sr-only">
            {profile.comfortLevel} / {MAX} — {comfortCopy.description}
          </span>
        </button>

        {openBar === 'comfort' && (
          <Explainer
            label={comfortCopy.label}
            text={comfortCopy.description}
            onClose={() => setOpenBar(null)}
          />
        )}
      </div>

      {/* ── Usage badges ── */}
      {(profile.dailyWear || profile.sportWear) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {profile.dailyWear && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
              ☕ Günlük kullanım uygun
            </span>
          )}
          {profile.sportWear && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600">
              🏃‍♀️ Spor için uygun
            </span>
          )}
        </div>
      )}
    </div>
  );
}
