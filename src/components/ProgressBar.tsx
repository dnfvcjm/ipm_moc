import { useI18n } from '../i18n/LanguageContext';

type ProgressBarProps = {
  current: number;
  total: number;
};

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const { t } = useI18n();
  const percent = Math.max(0, Math.min(100, (current / total) * 100));

  return (
    <div className="progress-wrap" aria-label={`${t.progress.aria} ${Math.round(percent)}%`}>
      <div className="progress-meta">
        <span>
          Plant {String(current).padStart(3, '0')} / {String(total).padStart(3, '0')}
        </span>
        <strong>{Math.round(percent)}%</strong>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
