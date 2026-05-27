import type { AnalysisStatus, Classification } from '../types';
import { useI18n } from '../i18n/LanguageContext';

type StatusBadgeProps = {
  status?: AnalysisStatus;
  classification?: Classification;
};

export default function StatusBadge({ status, classification }: StatusBadgeProps) {
  const { statusLabel, t } = useI18n();
  const translatedStatus = statusLabel(status);
  const label = classification ?? translatedStatus;
  const statusClass =
    translatedStatus === t.common.analyzed
      ? 'analyzed'
      : translatedStatus === t.common.analyzing
        ? 'analyzing'
        : 'pending';
  const className = classification
    ? `badge badge-class-${classification}`
    : `badge badge-status-${statusClass}`;

  return <span className={className}>{label}</span>;
}
