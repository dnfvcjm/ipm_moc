import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import SummaryCard from '../components/SummaryCard';
import { FIELD_ID } from '../data/appConfig';
import { analyzeRecords } from '../utils/analysis';
import { formatDate, formatDateTime } from '../utils/format';
import { getAllRecords, saveAnalysisResults } from '../utils/storage';

export default function AnalysisListPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState(() => getAllRecords());
  const [message, setMessage] = useState('');

  const summary = useMemo(
    () => ({
      total: records.length,
      analyzed: records.filter((record) => record.analysisStatus === '解析済み').length,
      pending: records.filter((record) => record.analysisStatus === '未解析').length,
      review: records.filter((record) => record.classification === 'A' || record.classification === 'B').length,
    }),
    [records],
  );

  const handleAnalyze = () => {
    const analyzedRecords = analyzeRecords(records);
    saveAnalysisResults(analyzedRecords);
    setRecords(analyzedRecords);
    setMessage('モック解析を実行しました。未解析データに分類結果とリスクスコアを付与しました。');
  };

  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">A-02</p>
        <h1>解析結果一覧</h1>
        <p className="lead">圃場・日付ごとの撮影データと解析ステータスを確認します。</p>
      </section>

      <section className="panel toolbar-panel">
        <div className="filter-row">
          <label>
            圃場ID
            <select value={FIELD_ID} disabled>
              <option>{FIELD_ID}</option>
            </select>
          </label>
          <label>
            日付
            <input type="text" value={formatDate()} disabled />
          </label>
        </div>
        <div className="button-row">
          <button className="button button-primary" onClick={handleAnalyze} type="button">
            モック解析を実行
          </button>
          <Link className="button button-secondary" to="/admin/classification">
            分類結果を見る
          </Link>
          <Link className="button button-secondary" to="/admin/heatmap">
            ヒートマップを見る
          </Link>
          <button className="button button-ghost" onClick={() => navigate('/admin')} type="button">
            戻る
          </button>
        </div>
        {message ? <p className="toast-message">{message}</p> : null}
      </section>

      <section className="summary-grid">
        <SummaryCard title="撮影件数" value={summary.total} />
        <SummaryCard title="解析済み件数" value={summary.analyzed} tone="good" />
        <SummaryCard title="未解析件数" value={summary.pending} tone="warning" />
        <SummaryCard title="要確認件数" value={summary.review} note="A/B分類" tone="danger" />
      </section>

      <section className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>レーンNo</th>
                <th>株No</th>
                <th>撮影日時</th>
                <th>解析ステータス</th>
                <th>分類結果</th>
                <th>リスクスコア</th>
                <th>推奨アクション</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} onClick={() => navigate(`/admin/detail/${record.id}`)}>
                  <td>Lane {record.laneNo}</td>
                  <td>{record.plantNo}</td>
                  <td>{formatDateTime(record.capturedAt)}</td>
                  <td>
                    <StatusBadge status={record.analysisStatus} />
                  </td>
                  <td>
                    <StatusBadge classification={record.classification} status={record.analysisStatus} />
                  </td>
                  <td>{record.riskScore ?? '-'}</td>
                  <td>{record.recommendedAction ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
