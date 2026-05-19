import type { AnalysisStatus, Classification } from '../types';

type StatusBadgeProps = {
  status?: AnalysisStatus;
  classification?: Classification;
};

export default function StatusBadge({ status, classification }: StatusBadgeProps) {
  const label = classification ?? status ?? '-';
  const statusClass =
    status === '解析済み' ? 'analyzed' : status === '解析中' ? 'analyzing' : 'pending';
  const className = classification
    ? `badge badge-class-${classification}`
    : `badge badge-status-${statusClass}`;

  return <span className={className}>{label}</span>;
}
