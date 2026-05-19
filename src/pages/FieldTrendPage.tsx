import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import FieldTrendChart from '../components/FieldTrendChart';
import SummaryCard from '../components/SummaryCard';
import { FIELD_ID, TARGET_LANE_NO } from '../data/appConfig';
import { sampleTreatments } from '../data/sampleTreatments';
import { sampleWeeklyRisk } from '../data/sampleWeeklyRisk';

const getAverageScore = (weekOffset: number) => {
  const rows = sampleWeeklyRisk.filter((summary) => summary.weekOffset === weekOffset);
  return rows.reduce((total, summary) => total + summary.areaRiskScore, 0) / Math.max(1, rows.length);
};

export default function FieldTrendPage() {
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
      <AppHeader current="全体リスク推移" />
      <section className="page-header">
        <p className="eyebrow">Field Trend</p>
        <h1>全体リスク推移</h1>
        <p className="lead">対象: {FIELD_ID} / Lane {TARGET_LANE_NO}</p>
      </section>
      <section className="summary-grid">
        <SummaryCard title="今週の平均リスク" value={currentAverage} />
        <SummaryCard title="前週との差分" value={currentAverage - previousAverage} tone={currentAverage > previousAverage ? 'danger' : 'good'} />
        <SummaryCard title="高リスクエリア数" value={highRiskCount} tone="danger" />
        <SummaryCard title="改善エリア数" value={improvedCount} tone="good" />
        <SummaryCard title="悪化エリア数" value={worsenedCount} tone="warning" />
        <SummaryCard title="防除ボトル数合計" value={`${bottleTotal}本`} tone="info" />
      </section>
      <section className="panel">
        <h2>5週前から今週までの推移</h2>
        <FieldTrendChart summaries={sampleWeeklyRisk} />
      </section>
      <div className="button-row">
        <Link className="button button-primary" to="/heatmap">エリア別Heatmapへ戻る</Link>
      </div>
    </main>
  );
}
