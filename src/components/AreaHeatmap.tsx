import type { AreaRiskSummary } from '../types';
import { useI18n } from '../i18n/LanguageContext';
import RiskBadge from './RiskBadge';

type AreaHeatmapProps = {
  summaries: AreaRiskSummary[];
  onSelectArea: (areaId: string, weekOffset?: number) => void;
  compact?: boolean;
};

export default function AreaHeatmap({ summaries, onSelectArea, compact = false }: AreaHeatmapProps) {
  const { t } = useI18n();

  return (
    <div className={`area-heatmap ${compact ? 'compact' : ''}`}>
      {summaries.map((summary) => (
        <button
          className={`area-cell area-${summary.areaRiskGrade}`}
          key={`${summary.weekOffset}-${summary.areaId}`}
          onClick={() => onSelectArea(summary.areaId, summary.weekOffset)}
          type="button"
        >
          <span>{summary.areaId}</span>
          <small>
            Plant {String(summary.areaStartPlant).padStart(3, '0')}-
            {String(summary.areaEndPlant).padStart(3, '0')}
          </small>
          <RiskBadge grade={summary.areaRiskGrade} />
          <strong>
            {summary.problemPhotoCount}/{summary.validPhotoCount}
          </strong>
          {!compact ? <em>{t.heatmap.recommendation} {summary.recommendedBottleCount} {t.common.bottles}</em> : null}
        </button>
      ))}
    </div>
  );
}
