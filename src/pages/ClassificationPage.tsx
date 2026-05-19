import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import SummaryCard from '../components/SummaryCard';
import type { Classification } from '../types';
import { classificationDefinitions } from '../utils/analysis';
import { getAllRecords } from '../utils/storage';

type FilterValue = Classification | 'all';

const filterOptions: { label: string; value: FilterValue }[] = [
  { label: 'すべて', value: 'all' },
  { label: 'Aのみ', value: 'A' },
  { label: 'Bのみ', value: 'B' },
  { label: 'Cのみ', value: 'C' },
  { label: 'Zのみ', value: 'Z' },
];

export default function ClassificationPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterValue>('all');
  const records = useMemo(() => getAllRecords().filter((record) => record.classification), []);

  const counts = useMemo(
    () => ({
      A: records.filter((record) => record.classification === 'A').length,
      B: records.filter((record) => record.classification === 'B').length,
      C: records.filter((record) => record.classification === 'C').length,
      Z: records.filter((record) => record.classification === 'Z').length,
    }),
    [records],
  );

  const filteredRecords =
    filter === 'all' ? records : records.filter((record) => record.classification === filter);

  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">A-03</p>
        <h1>分類結果表示</h1>
        <p className="lead">A/B/C/Z分類の件数、状態、想定アクションを俯瞰します。</p>
      </section>

      <section className="summary-grid class-summary">
        {(['A', 'B', 'C', 'Z'] as Classification[]).map((classification) => (
          <SummaryCard
            key={classification}
            title={`${classification}: ${classificationDefinitions[classification].state}`}
            value={counts[classification]}
            note={classificationDefinitions[classification].action}
            tone={classification === 'A' ? 'danger' : classification === 'B' ? 'warning' : classification === 'C' ? 'info' : 'good'}
          />
        ))}
      </section>

      <section className="panel legend-panel">
        <h2>A/B/C/Z分類定義</h2>
        <div className="legend-grid">
          {(['A', 'B', 'C', 'Z'] as Classification[]).map((classification) => (
            <article className={`legend-card legend-${classification}`} key={classification}>
              <strong>{classification}</strong>
              <p>状態: {classificationDefinitions[classification].state}</p>
              <p>想定アクション: {classificationDefinitions[classification].action}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="panel toolbar-panel">
        <div className="segmented-control" aria-label="分類フィルタ">
          {filterOptions.map((option) => (
            <button
              className={filter === option.value ? 'active' : ''}
              key={option.value}
              onClick={() => setFilter(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="button-row">
          <Link className="button button-secondary" to="/admin/heatmap">
            ヒートマップを見る
          </Link>
          <Link className="button button-ghost" to="/admin/analysis">
            一覧へ戻る
          </Link>
        </div>
      </section>

      <section className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>圃場ID</th>
                <th>レーンNo</th>
                <th>株No</th>
                <th>分類</th>
                <th>リスクスコア</th>
                <th>推奨アクション</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} onClick={() => navigate(`/admin/detail/${record.id}`)}>
                  <td>{record.fieldId}</td>
                  <td>Lane {record.laneNo}</td>
                  <td>{record.plantNo}</td>
                  <td>
                    <StatusBadge classification={record.classification} />
                  </td>
                  <td>{record.riskScore ?? '-'}</td>
                  <td>{record.recommendedAction}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
