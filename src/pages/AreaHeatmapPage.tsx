import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import AreaHeatmap from '../components/AreaHeatmap';
import RiskBadge from '../components/RiskBadge';
import SummaryCard from '../components/SummaryCard';
import TimelineSlider from '../components/TimelineSlider';
import { FIELD_ID, TARGET_LANE_NO } from '../data/appConfig';
import { sampleWeeklyRisk } from '../data/sampleWeeklyRisk';
import { useI18n } from '../i18n/LanguageContext';
import type { AreaRiskSummary } from '../types';
import { getCurrentAreaRiskSummaries } from '../utils/storage';

const getSummariesForWeek = (weekOffset: number): AreaRiskSummary[] => {
  const current = getCurrentAreaRiskSummaries();
  if (weekOffset === 0 && current.length > 0 && current.some((summary) => summary.validPhotoCount > 0)) {
    return current;
  }
  return sampleWeeklyRisk.filter((summary) => summary.weekOffset === weekOffset);
};

export default function AreaHeatmapPage() {
  const navigate = useNavigate();
  const { riskLabel, t } = useI18n();
  const [weekOffset, setWeekOffset] = useState(0);
  const summaries = useMemo(() => getSummariesForWeek(weekOffset), [weekOffset]);
  const previous = getSummariesForWeek(weekOffset - 1);
  const highRiskCount = summaries.filter((summary) => summary.areaRiskGrade === 'A').length;
  const reviewCount = summaries.filter((summary) => summary.areaRiskGrade === 'A' || summary.areaRiskGrade === 'B').length;
  const worsened = summaries.filter((summary) => {
    const prev = previous.find((item) => item.areaId === summary.areaId);
    return prev ? summary.areaRiskScore > prev.areaRiskScore : false;
  }).length;
  const improved = summaries.filter((summary) => {
    const prev = previous.find((item) => item.areaId === summary.areaId);
    return prev ? summary.areaRiskScore < prev.areaRiskScore : false;
  }).length;

  return (
    <main className="page-shell wide-page">
      <AppHeader current={t.heatmap.current} />
      <section className="page-header">
        <p className="eyebrow">Area Heatmap</p>
        <h1>{t.heatmap.title}</h1>
        <p className="lead">{FIELD_ID} / Lane {TARGET_LANE_NO} / {t.heatmap.lead}</p>
      </section>
      <section className="panel toolbar-panel">
        <TimelineSlider value={weekOffset} onChange={setWeekOffset} />
      </section>
      <section className="summary-grid">
        <SummaryCard title={t.heatmap.highRiskAreas} value={highRiskCount} tone="danger" />
        <SummaryCard title={t.heatmap.reviewAreas} value={reviewCount} tone="warning" />
        <SummaryCard title={t.heatmap.worsened} value={worsened} tone="danger" />
        <SummaryCard title={t.heatmap.improved} value={improved} tone="good" />
      </section>
      <section className="panel legend-panel">
        <h2>{t.heatmap.legend}</h2>
        <div className="legend-row">
          <RiskBadge grade="A" label={`A: ${riskLabel('A')}`} />
          <RiskBadge grade="B" label={`B: ${riskLabel('B')}`} />
          <RiskBadge grade="C" label={`C: ${riskLabel('C')}`} />
          <RiskBadge grade="Z" label={`Z: ${riskLabel('Z')}`} />
        </div>
        <p className="note-text">{t.common.finalDecisionNote}</p>
      </section>
      <section className="panel heatmap-panel">
        <AreaHeatmap
          summaries={summaries}
          onSelectArea={(areaId, selectedWeek) => navigate(`/area/${encodeURIComponent(areaId)}?week=${selectedWeek ?? weekOffset}`)}
        />
      </section>
      <div className="button-row">
        <Link className="button button-primary" to="/trend">{t.heatmap.viewTrend}</Link>
        <Link className="button button-secondary" to="/analysis">{t.common.backToAnalysis}</Link>
        <Link className="button button-ghost" to="/">{t.common.backHome}</Link>
      </div>
    </main>
  );
}
