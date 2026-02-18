/**
 * Feel & Compression Indicator — product slug mapping
 * Until these fields exist in the DB, this file serves as the source of truth.
 * Keys are product slugs. Unrecognised slugs fall back to defaults.
 */

export interface FeelProfile {
  compressionLevel: number; // 1–7  (toparlayıcı etki)
  comfortLevel: number;     // 1–7  (rahatlık)
  dailyWear: boolean;
  sportWear: boolean;
}

const DEFAULT_PROFILE: FeelProfile = {
  compressionLevel: 3,
  comfortLevel: 5,
  dailyWear: true,
  sportWear: false,
};

/**
 * Slug-based overrides.
 * Naming convention mirrors collection slugs so collection-level defaults work:
 *   she-moves products   → sporty: high comfort, medium compression
 *   2nd-skn products     → high compression, medium comfort
 *   everyday products    → low compression, high comfort
 */
const PROFILES: Record<string, FeelProfile> = {
  // ── she-moves collection ─────────────────────────────────────────────────
  'she-moves-tayt':           { compressionLevel: 4, comfortLevel: 6, dailyWear: false, sportWear: true },
  'she-moves-bra':            { compressionLevel: 3, comfortLevel: 6, dailyWear: false, sportWear: true },
  'she-moves-sort':           { compressionLevel: 3, comfortLevel: 7, dailyWear: true,  sportWear: true },
  'she-moves-set':            { compressionLevel: 4, comfortLevel: 6, dailyWear: false, sportWear: true },

  // ── 2nd-skn collection ───────────────────────────────────────────────────
  '2nd-skn-tayt':             { compressionLevel: 6, comfortLevel: 4, dailyWear: false, sportWear: false },
  '2nd-skn-sort':             { compressionLevel: 5, comfortLevel: 4, dailyWear: true,  sportWear: false },
  '2nd-skn-set':              { compressionLevel: 6, comfortLevel: 4, dailyWear: false, sportWear: false },
  '2nd-skn-body':             { compressionLevel: 7, comfortLevel: 3, dailyWear: false, sportWear: false },

  // ── everyday collection ──────────────────────────────────────────────────
  'everyday-tayt':            { compressionLevel: 2, comfortLevel: 7, dailyWear: true,  sportWear: false },
  'everyday-esofman-alti':    { compressionLevel: 1, comfortLevel: 7, dailyWear: true,  sportWear: false },
  'everyday-sort':            { compressionLevel: 2, comfortLevel: 7, dailyWear: true,  sportWear: true  },
};

/** Returns feel profile for a given product slug, with collection-level fallback. */
export function getFeelProfile(slug: string): FeelProfile {
  if (PROFILES[slug]) return PROFILES[slug];

  // Collection-level defaults based on slug prefix
  if (slug.startsWith('she-moves')) return { compressionLevel: 4, comfortLevel: 6, dailyWear: false, sportWear: true };
  if (slug.startsWith('2nd-skn'))   return { compressionLevel: 6, comfortLevel: 4, dailyWear: false, sportWear: false };
  if (slug.startsWith('everyday'))  return { compressionLevel: 2, comfortLevel: 7, dailyWear: true,  sportWear: false };

  return DEFAULT_PROFILE;
}

/** Compression level label + explanation copy */
export function getCompressionCopy(level: number): { label: string; description: string } {
  if (level <= 2) return {
    label: 'Hafif',
    description: 'Günlük kullanım için idealdir, baskı hissi oluşturmaz.',
  };
  if (level <= 4) return {
    label: 'Orta',
    description: 'Hafif toparlar, gün boyu konfor sağlar.',
  };
  return {
    label: 'Güçlü',
    description: 'Yoğun şekillendirici etki sunar, kısa süreli kullanım önerilir.',
  };
}

/** Comfort level label */
export function getComfortCopy(level: number): { label: string; description: string } {
  if (level <= 2) return { label: 'Sıkı', description: 'Baskı hissi belirgindir; şekillendirici model.' };
  if (level <= 4) return { label: 'Dengeli', description: 'Hem destek hem hareket özgürlüğü sunar.' };
  return { label: 'Çok rahat', description: 'Neredeyse ikinci bir ten gibi hissettiren yumuşak kumaş.' };
}
