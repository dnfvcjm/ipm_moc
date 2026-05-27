import { sampleTreatments } from '../data/sampleTreatments';
import { useI18n } from '../i18n/LanguageContext';
import type { AreaRiskSummary } from '../types';

type FieldTrendChartProps = {
  summaries: AreaRiskSummary[];
};

export default function FieldTrendChart({ summaries }: FieldTrendChartProps) {
  const { t, weekLabel } = useI18n();
  const grouped = [-5, -4, -3, -2, -1, 0].map((weekOffset) => {
    const weekSummaries = summaries.filter((summary) => summary.weekOffset === weekOffset);
    const average =
      weekSummaries.reduce((total, summary) => total + summary.areaRiskScore, 0) /
      Math.max(1, weekSummaries.length);
    const highRiskCount = weekSummaries.filter((summary) => summary.areaRiskGrade === 'A').length;
    const label = weekLabel(weekOffset);
    const bottleCount = sampleTreatments
      .filter((treatment) => treatment.weekOffset === weekOffset)
      .reduce((total, treatment) => total + treatment.bottleCount, 0);

    return { weekOffset, label, average, highRiskCount, bottleCount };
  });

  return (
    <div className="field-trend-chart">
      {grouped.map((week) => (
        <div className="field-trend-column" key={week.weekOffset}>
          <div className="field-trend-bars">
            <span className="field-score-bar" style={{ height: `${Math.max(8, week.average)}%` }} />
            <span className="field-bottle-bar" style={{ height: `${week.bottleCount * 18}%` }} />
          </div>
          <strong>{Math.round(week.average)}</strong>
          <span>{week.label}</span>
          <small>{t.fieldTrend.highRisk} {week.highRiskCount} / {t.fieldTrend.treatment} {week.bottleCount} {t.common.bottles}</small>
        </div>
      ))}
    </div>
  );
}
