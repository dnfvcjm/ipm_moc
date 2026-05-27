import { sampleTreatments } from '../data/sampleTreatments';
import { useI18n } from '../i18n/LanguageContext';
import type { AreaRiskSummary } from '../types';
import RiskBadge from './RiskBadge';

type AreaTrendChartProps = {
  areaId: string;
  summaries: AreaRiskSummary[];
};

export default function AreaTrendChart({ areaId, summaries }: AreaTrendChartProps) {
  const { t, weekLabel } = useI18n();
  const treatments = sampleTreatments.filter((treatment) => treatment.areaId === areaId);

  return (
    <div className="trend-chart">
      {summaries.map((summary) => {
        const treatment = treatments.find((item) => item.weekOffset === summary.weekOffset);
        const height = Math.max(8, summary.areaRiskScore);

        return (
          <div className="trend-column" key={summary.weekOffset}>
            <div className="trend-bars">
              <span className={`risk-bar risk-fill-${summary.areaRiskGrade}`} style={{ height: `${height}%` }} />
              <span className="bottle-bar" style={{ height: `${(treatment?.bottleCount ?? 0) * 24}%` }} />
            </div>
            <RiskBadge grade={summary.areaRiskGrade} />
            <small>{weekLabel(summary.weekOffset)}</small>
            <em>{treatment ? `${treatment.bottleCount} ${t.common.bottles}` : `0 ${t.common.bottles}`}</em>
          </div>
        );
      })}
    </div>
  );
}
