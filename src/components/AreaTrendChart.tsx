import { sampleTreatments } from '../data/sampleTreatments';
import type { AreaRiskSummary } from '../types';
import RiskBadge from './RiskBadge';

type AreaTrendChartProps = {
  areaId: string;
  summaries: AreaRiskSummary[];
};

export default function AreaTrendChart({ areaId, summaries }: AreaTrendChartProps) {
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
            <small>{summary.weekLabel}</small>
            <em>{treatment ? `${treatment.bottleCount}本` : '0本'}</em>
          </div>
        );
      })}
    </div>
  );
}
