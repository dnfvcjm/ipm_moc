import { Link, useNavigate } from 'react-router-dom';
import HeatmapGrid from '../components/HeatmapGrid';
import SummaryCard from '../components/SummaryCard';
import { LANE_NUMBERS } from '../data/appConfig';
import type { Classification } from '../types';
import { classificationDefinitions } from '../utils/analysis';
import { getAllRecords } from '../utils/storage';

export default function HeatmapPage() {
  const navigate = useNavigate();
  const records = getAllRecords();

  const laneMaxScores = LANE_NUMBERS.map((laneNo) => {
    const laneScores = records
      .filter((record) => record.laneNo === laneNo)
      .map((record) => record.riskScore ?? 0);
    return {
      laneNo,
      score: laneScores.length > 0 ? Math.max(...laneScores) : 0,
    };
  });
  const highestLane = laneMaxScores.sort((a, b) => b.score - a.score)[0];
  const reviewCount = records.filter(
    (record) => record.classification === 'A' || record.classification === 'B',
  ).length;
  const recommendedAction =
    reviewCount > 0 ? 'Lane 03周辺を重点観察し、A分類株は天敵散布を検討' : '通常巡回を継続';

  return (
    <main className="page-shell wide-page">
      <section className="page-header">
        <p className="eyebrow">A-04</p>
        <h1>ヒートマップ</h1>
        <p className="lead">点の観察結果をレーンと株のグリッドに展開し、面でリスクを把握します。</p>
      </section>

      <section className="summary-grid">
        <SummaryCard title="最もリスクが高いレーン" value={`Lane ${highestLane.laneNo}`} note={`最大スコア ${highestLane.score}`} tone="danger" />
        <SummaryCard title="要確認株数" value={reviewCount} note="A/B分類" tone="warning" />
        <SummaryCard title="推奨アクション例" value={recommendedAction} tone="info" />
      </section>

      <section className="panel legend-panel">
        <h2>凡例</h2>
        <div className="legend-grid compact">
          {(['A', 'B', 'C', 'Z'] as Classification[]).map((classification) => (
            <article className={`legend-card legend-${classification}`} key={classification}>
              <strong>{classification}</strong>
              <p>{classificationDefinitions[classification].riskLabel}</p>
              <p>{classificationDefinitions[classification].state}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel heatmap-panel">
        <HeatmapGrid
          records={records}
          onCellClick={(record) => navigate(`/admin/detail/${record.id}`)}
        />
      </section>

      <div className="button-row">
        <Link className="button button-secondary" to="/admin/analysis">
          一覧へ戻る
        </Link>
        <Link className="button button-ghost" to="/admin/classification">
          分類結果へ戻る
        </Link>
      </div>
    </main>
  );
}
