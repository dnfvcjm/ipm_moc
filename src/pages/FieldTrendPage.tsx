import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import FieldTrendChart from '../components/FieldTrendChart';
import SummaryCard from '../components/SummaryCard';
import { FIELD_ID, TARGET_LANE_NO } from '../data/appConfig';
import { sampleTreatments } from '../data/sampleTreatments';
import { sampleWeeklyRisk } from '../data/sampleWeeklyRisk';
import { useI18n } from '../i18n/LanguageContext';

const getAverageScore = (weekOffset: number) => {
  const rows = sampleWeeklyRisk.filter((summary) => summary.weekOffset === weekOffset);
  return rows.reduce((total, summary) => total + summary.areaRiskScore, 0) / Math.max(1, rows.length);
};

export default function FieldTrendPage() {
  const { t } = useI18n();
  const currentAverage = Math.round(getAverageScore(0));
  const previousAverage = Math.round(getAverageScore(-1));
  const currentSummaries = sampleWeeklyRisk.filter((summary) => summary.weekOffset === 0);
  const previousSummaries = sampleWeeklyRisk.filter((summary) => summary.weekOffset === -1);
  const highRiskCount = currentSummaries.filter((summary) => summary.areaRiskGrade === 'A').length;
  const improvedCount = currentSummaries.filter((summary) => {
    const prev = previousSummaries.find((item) => item.areaId === summary.areaId);
    return prev ? summary.areaRiskScore < prev.areaRiskScore : false;
  }).length;
  const worsenedCount = currentSummaries.filter((summary) => {
    const prev = previousSummaries.find((item) => item.areaId === summary.areaId);
    return prev ? summary.areaRiskScore > prev.areaRiskScore : false;
  }).length;
  const bottleTotal = sampleTreatments.reduce((total, treatment) => total + treatment.bottleCount, 0);

  return (
    <main className="page-shell">
      <AppHeader current={t.fieldTrend.current} />
      <section className="page-header">
        <p className="eyebrow">Field Trend</p>
        <h1>{t.fieldTrend.title}</h1>
        <p className="lead">{t.common.target}: {FIELD_ID} / Lane {TARGET_LANE_NO}</p>
      </section>
      <section className="summary-grid">
        <SummaryCard title={t.fieldTrend.currentAverage} value={currentAverage} />
        <SummaryCard title={t.fieldTrend.difference} value={currentAverage - previousAverage} tone={currentAverage > previousAverage ? 'danger' : 'good'} />
        <SummaryCard title={t.fieldTrend.highRiskAreas} value={highRiskCount} tone="danger" />
        <SummaryCard title={t.fieldTrend.improvedAreas} value={improvedCount} tone="good" />
        <SummaryCard title={t.fieldTrend.worsenedAreas} value={worsenedCount} tone="warning" />
        <SummaryCard title={t.fieldTrend.bottleTotal} value={`${bottleTotal} ${t.common.bottles}`} tone="info" />
      </section>
      <section className="panel">
        <h2>{t.fieldTrend.chartTitle}</h2>
        <FieldTrendChart summaries={sampleWeeklyRisk} />
      </section>
      <div className="button-row">
        <Link className="button button-primary" to="/heatmap">{t.timelineHeatmap.backToAreaHeatmap}</Link>
      </div>
    </main>
  );
}
