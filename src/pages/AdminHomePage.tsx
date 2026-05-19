import { Link } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import { classificationDefinitions } from '../utils/analysis';
import { formatDate, formatDateTime } from '../utils/format';
import { getAllRecords } from '../utils/storage';

export default function AdminHomePage() {
  const records = getAllRecords();
  const analyzedRecords = records.filter((record) => record.analysisStatus === '解析済み');
  const latestAnalyzedRecord = [...analyzedRecords].sort((a, b) =>
    b.capturedAt.localeCompare(a.capturedAt),
  )[0];
  const pendingCount = records.filter((record) => record.analysisStatus === '未解析').length;
  const highRiskCount = records.filter(
    (record) => record.classification === 'A' || (record.riskScore ?? 0) >= 80,
  ).length;

  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">A-01</p>
        <h1>DN IPM App</h1>
        <p className="lead">スペクトルカメラ画像の解析状況とリスク分布を確認します。</p>
      </section>

      <section className="dashboard-grid">
        <article className="panel menu-card">
          <div>
            <p className="eyebrow">Analysis Menu</p>
            <h2>スペクトルカメラ画像解析</h2>
            <p>撮影データの解析結果、A/B/C/Z分類、ヒートマップを確認します。</p>
          </div>
          <Link className="button button-primary" to="/admin/analysis">
            スペクトルカメラ画像解析を開く
          </Link>
          <Link className="button button-ghost" to="/">
            ホームへ戻る
          </Link>
        </article>

        <div className="summary-grid">
          <SummaryCard
            title="最新解析日"
            value={latestAnalyzedRecord ? formatDateTime(latestAnalyzedRecord.capturedAt) : formatDate()}
            tone="info"
          />
          <SummaryCard title="撮影件数" value={records.length} note="サンプル + 保存データ" />
          <SummaryCard title="未解析件数" value={pendingCount} tone="warning" />
          <SummaryCard
            title="High Risk件数"
            value={highRiskCount}
            note={classificationDefinitions.A.action}
            tone="danger"
          />
        </div>
      </section>
    </main>
  );
}
