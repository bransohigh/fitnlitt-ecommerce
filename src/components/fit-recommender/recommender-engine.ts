/**
 * Fit Recommender — Mapping Engine
 * Pure deterministic logic, no AI required.
 */

export type HeightOption = '155-' | '156-168' | '169-178' | '179+';
export type BodyTypeOption = 'ince' | 'fit' | 'basen' | 'karin';
export type GoalOption = 'gunluk' | 'spor' | 'toparlayici';

export interface Answers {
  height: HeightOption | null;
  bodyType: BodyTypeOption | null;
  goal: GoalOption | null;
}

export interface RecommendationResult {
  collectionSlug: string;
  collectionLabel: string;
  size: 'S' | 'M' | 'L' | 'XL';
  sizeReason: string;
}

// ─── Collection mapping ───────────────────────────────────────────────────────

function resolveCollection(goal: GoalOption): { slug: string; label: string } {
  switch (goal) {
    case 'toparlayici': return { slug: '2nd-skn',   label: '2nd Skin' };
    case 'spor':        return { slug: 'she-moves', label: 'She Moves' };
    case 'gunluk':      return { slug: 'everyday',  label: 'Everyday' };
  }
}

// ─── Size mapping ─────────────────────────────────────────────────────────────

function resolveSize(height: HeightOption, bodyType: BodyTypeOption): {
  size: 'S' | 'M' | 'L' | 'XL';
  reason: string;
} {
  // XL triggers: large body or karin regardless of height
  if (bodyType === 'karin') return { size: 'XL', reason: 'Karın bölgesi için rahat kesim' };

  if (height === '155-') {
    if (bodyType === 'ince') return { size: 'S',  reason: 'Kısa boy + ince yapı için ideal' };
    if (bodyType === 'fit')  return { size: 'M',  reason: 'Kısa boy + fit yapı için ideal' };
    if (bodyType === 'basen') return { size: 'M', reason: 'Basen bölgesine uygun kesim' };
  }

  if (height === '156-168') {
    if (bodyType === 'ince') return { size: 'M',  reason: 'Orta boy + ince yapı için ideal' };
    if (bodyType === 'fit')  return { size: 'M',  reason: 'Orta boy + fit yapı için ideal' };
    if (bodyType === 'basen') return { size: 'L', reason: 'Basen bölgesine uygun geniş kesim' };
  }

  if (height === '169-178') {
    if (bodyType === 'ince') return { size: 'M',  reason: 'Uzun boy + ince yapı için ideal' };
    if (bodyType === 'fit')  return { size: 'L',  reason: 'Uzun boy + fit yapı için ideal' };
    if (bodyType === 'basen') return { size: 'L', reason: 'Uzun boy + basen için geniş kesim' };
  }

  // 179+
  if (bodyType === 'ince') return { size: 'L',  reason: 'Uzun boy için rahat kesim' };
  if (bodyType === 'fit')  return { size: 'L',  reason: 'Uzun boy + fit yapı için ideal' };
  if (bodyType === 'basen') return { size: 'XL', reason: 'Uzun boy + basen için geniş kesim' };

  return { size: 'M', reason: 'Genel uyum için' };
}

// ─── Main resolve function ────────────────────────────────────────────────────

export function getRecommendation(answers: Answers): RecommendationResult | null {
  if (!answers.height || !answers.bodyType || !answers.goal) return null;

  const { slug, label } = resolveCollection(answers.goal);
  const { size, reason } = resolveSize(answers.height, answers.bodyType);

  return {
    collectionSlug: slug,
    collectionLabel: label,
    size,
    sizeReason: reason,
  };
}
