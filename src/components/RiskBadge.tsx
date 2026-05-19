import type { Classification } from '../types';

type RiskBadgeProps = {
  grade?: Classification;
  label?: string;
};

export default function RiskBadge({ grade, label }: RiskBadgeProps) {
  return <span className={`risk-badge risk-${grade ?? 'none'}`}>{label ?? grade ?? '-'}</span>;
}
