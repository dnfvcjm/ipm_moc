import type { Classification } from '../types';

export type SpectralMarker = {
  left: string;
  top: string;
  size: 'small' | 'medium' | 'large';
};

type MarkerOptions = {
  grade?: Classification;
  problemRatio?: number;
  riskScore?: number;
  seed?: string;
};

const leafSurfaceAnchors: SpectralMarker[] = [
  { left: '32%', top: '31%', size: 'medium' },
  { left: '41%', top: '37%', size: 'small' },
  { left: '51%', top: '32%', size: 'medium' },
  { left: '61%', top: '37%', size: 'small' },
  { left: '70%', top: '43%', size: 'medium' },
  { left: '25%', top: '45%', size: 'small' },
  { left: '35%', top: '51%', size: 'medium' },
  { left: '47%', top: '54%', size: 'small' },
  { left: '59%', top: '52%', size: 'large' },
  { left: '74%', top: '56%', size: 'small' },
  { left: '83%', top: '50%', size: 'medium' },
  { left: '28%', top: '62%', size: 'medium' },
  { left: '42%', top: '66%', size: 'small' },
  { left: '64%', top: '64%', size: 'medium' },
  { left: '79%', top: '68%', size: 'small' },
];

const gradeFallbackCount: Record<Classification, number> = {
  A: 10,
  B: 6,
  C: 3,
  Z: 1,
};

const hashSeed = (seed: string) => {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const seededShuffle = <T,>(items: T[], seed: string) => {
  const shuffled = [...items];
  let state = hashSeed(seed || 'spectral-marker');

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const getMarkerCount = ({ grade, problemRatio, riskScore }: MarkerOptions) => {
  if (grade === 'A') return clamp(8 + Math.round((problemRatio ?? 0.75) * 4), 8, 12);
  if (grade === 'B') return clamp(4 + Math.round((problemRatio ?? 0.5) * 3), 4, 7);
  if (grade === 'C') return clamp(1 + Math.round((problemRatio ?? 0.2) * 6), 1, 4);
  if (grade === 'Z') return riskScore && riskScore > 20 ? 2 : 1;

  if (typeof riskScore === 'number') {
    if (riskScore >= 80) return 10;
    if (riskScore >= 60) return 6;
    if (riskScore >= 35) return 3;
  }

  return grade ? gradeFallbackCount[grade] : 5;
};

export const getSpectralDetectionMarkers = (options: MarkerOptions = {}) => {
  const count = getMarkerCount(options);
  const seed = [
    options.seed ?? 'spectral-marker',
    options.grade ?? 'none',
    options.riskScore ?? 'none',
    options.problemRatio ?? 'none',
  ].join(':');

  return seededShuffle(leafSurfaceAnchors, seed).slice(0, count);
};
