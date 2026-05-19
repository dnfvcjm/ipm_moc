import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import AreaHeatmap from '../components/AreaHeatmap';
import RiskBadge from '../components/RiskBadge';
import SummaryCard from '../components/SummaryCard';
import TimelineSlider from '../components/TimelineSlider';
import { FIELD_ID, TARGET_LANE_NO } from '../data/appConfig';
import { sampleWeeklyRisk } from '../data/sampleWeeklyRisk';
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
      <AppHeader current="エリア別Heatmap" />
      <section className="page-header">
        <p className="eyebrow">Area Heatmap</p>
        <h1>エリア別リスクHeatmap</h1>
        <p className="lead">{FIELD_ID} / Lane {TARGET_LANE_NO} / 1Areaは約5m・3株単位です。</p>
      </section>
      <section className="panel toolbar-panel">
        <TimelineSlider value={weekOffset} onChange={setWeekOffset} />
      </section>
      <section className="summary-grid">
        <SummaryCard title="高リスクエリア数" value={highRiskCount} tone="danger" />
        <SummaryCard title="要確認エリア数" value={reviewCount} tone="warning" />
        <SummaryCard title="前週から悪化" value={worsened} tone="danger" />
        <SummaryCard title="前週から改善" value={improved} tone="good" />
      </section>
      <section className="panel legend-panel">
        <h2>凡例</h2>
        <div className="legend-row">
          <RiskBadge grade="A" label="A: 高リスク" />
          <RiskBadge grade="B" label="B: 中高リスク" />
          <RiskBadge grade="C" label="C: 注意" />
          <RiskBadge grade="Z" label="Z: 問題なし" />
        </div>
        <p className="note-text">ボトル数は推奨であり、最終判断は管理者が行います。</p>
      </section>
      <section className="panel heatmap-panel">
        <AreaHeatmap
          summaries={summaries}
          onSelectArea={(areaId, selectedWeek) => navigate(`/area/${encodeURIComponent(areaId)}?week=${selectedWeek ?? weekOffset}`)}
        />
      </section>
      <div className="button-row">
        <Link className="button button-primary" to="/trend">全体リスク推移を見る</Link>
        <Link className="button button-secondary" to="/analysis">未解析データへ戻る</Link>
        <Link className="button button-ghost" to="/">ホームへ戻る</Link>
      </div>
    </main>
  );
}
