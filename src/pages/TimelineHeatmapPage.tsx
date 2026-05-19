import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import RiskBadge from '../components/RiskBadge';
import SummaryCard from '../components/SummaryCard';
import { WEEK_OPTIONS } from '../data/appConfig';
import { sampleWeeklyRisk } from '../data/sampleWeeklyRisk';

export default function TimelineHeatmapPage() {
  const navigate = useNavigate();
  const areaIds = Array.from(new Set(sampleWeeklyRisk.map((summary) => summary.areaId)));
  const improving = areaIds.filter((areaId) => {
    const first = sampleWeeklyRisk.find((summary) => summary.areaId === areaId && summary.weekOffset === -5);
    const current = sampleWeeklyRisk.find((summary) => summary.areaId === areaId && summary.weekOffset === 0);
    return first && current && current.areaRiskScore < first.areaRiskScore;
  });
  const worsening = areaIds.filter((areaId) => {
    const prev = sampleWeeklyRisk.find((summary) => summary.areaId === areaId && summary.weekOffset === -1);
    const current = sampleWeeklyRisk.find((summary) => summary.areaId === areaId && summary.weekOffset === 0);
    return prev && current && current.areaRiskScore > prev.areaRiskScore;
  });
  const continuousHigh = areaIds.filter((areaId) =>
    sampleWeeklyRisk.filter((summary) => summary.areaId === areaId && summary.areaRiskGrade === 'A').length >= 2,
  );

  return (
    <main className="page-shell wide-page">
      <AppHeader current="時間軸Heatmap" />
      <section className="page-header">
        <p className="eyebrow">Timeline Heatmap</p>
        <h1>時間軸Heatmap</h1>
      </section>
      <section className="summary-grid">
        <SummaryCard title="改善しているエリア" value={improving.join(', ') || '-'} tone="good" />
        <SummaryCard title="拡大傾向のエリア" value={worsening.join(', ') || '-'} tone="danger" />
        <SummaryCard title="継続して高リスク" value={continuousHigh.join(', ') || '-'} tone="warning" />
      </section>
      <section className="panel timeline-heatmap-panel">
        <div className="timeline-heatmap">
          <div className="timeline-head">Area</div>
          {WEEK_OPTIONS.map((week) => <div className="timeline-head" key={week.weekOffset}>{week.weekLabel}</div>)}
          {areaIds.map((areaId) => (
            <Fragment key={areaId}>
              <div className="timeline-area-label">{areaId}</div>
              {WEEK_OPTIONS.map((week) => {
                const summary = sampleWeeklyRisk.find((item) => item.areaId === areaId && item.weekOffset === week.weekOffset);
                return (
                  <button
                    className={`timeline-cell timeline-${summary?.areaRiskGrade ?? 'Z'}`}
                    key={`${areaId}-${week.weekOffset}`}
                    onClick={() => navigate(`/area/${encodeURIComponent(areaId)}?week=${week.weekOffset}`)}
                    type="button"
                  >
                    <RiskBadge grade={summary?.areaRiskGrade} />
                  </button>
                );
              })}
            </Fragment>
          ))}
        </div>
      </section>
      <div className="button-row">
        <Link className="button button-primary" to="/heatmap">エリア別Heatmapへ戻る</Link>
      </div>
    </main>
  );
}
