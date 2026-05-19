import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import type { Classification } from '../types';
import { classificationDefinitions } from '../utils/analysis';
import { formatDateTime } from '../utils/format';
import { getAllRecords, saveMemo } from '../utils/storage';

export default function DetailPage() {
  const { id } = useParams();
  const [records, setRecords] = useState(() => getAllRecords());
  const record = records.find((item) => item.id === id);
  const [memo, setMemo] = useState(record?.memo ?? '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setMemo(record?.memo ?? '');
  }, [record?.id, record?.memo]);

  const classification = record?.classification as Classification | undefined;
  const definition = classification ? classificationDefinitions[classification] : undefined;

  const handleSave = () => {
    if (!record) return;
    saveMemo(record.id, memo);
    setRecords(getAllRecords());
    setMessage('判断を保存しました');
    window.setTimeout(() => setMessage(''), 2200);
  };

  if (!record) {
    return (
      <main className="page-shell narrow-page">
        <section className="panel action-panel">
          <h1>対象データが見つかりません</h1>
          <Link className="button button-primary" to="/admin/analysis">
            一覧へ戻る
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">A-05</p>
        <h1>詳細確認・判断</h1>
        <p className="lead">特定のレーン・株の解析結果を確認し、現場アクションを記録します。</p>
      </section>

      <section className="detail-grid">
        <article className="panel">
          <h2>基本情報</h2>
          <dl className="meta-list stacked">
            <div>
              <dt>圃場ID</dt>
              <dd>{record.fieldId}</dd>
            </div>
            <div>
              <dt>レーンNo</dt>
              <dd>{record.laneNo}</dd>
            </div>
            <div>
              <dt>株No</dt>
              <dd>{record.plantNo}</dd>
            </div>
            <div>
              <dt>撮影日時</dt>
              <dd>{formatDateTime(record.capturedAt)}</dd>
            </div>
            <div>
              <dt>撮影者</dt>
              <dd>{record.capturedBy}</dd>
            </div>
            <div>
              <dt>画像ID</dt>
              <dd>{record.imageId}</dd>
            </div>
          </dl>
        </article>

        <article className="panel">
          <h2>解析情報</h2>
          <dl className="meta-list stacked">
            <div>
              <dt>解析ステータス</dt>
              <dd>
                <StatusBadge status={record.analysisStatus} />
              </dd>
            </div>
            <div>
              <dt>分類結果</dt>
              <dd>
                <StatusBadge classification={record.classification} status={record.analysisStatus} />
              </dd>
            </div>
            <div>
              <dt>リスクスコア</dt>
              <dd>{record.riskScore ?? '-'}</dd>
            </div>
            <div>
              <dt>推奨アクション</dt>
              <dd>{record.recommendedAction ?? '-'}</dd>
            </div>
          </dl>
        </article>
      </section>

      <section className="detail-grid">
        <article className="panel action-recommendation">
          <h2>分類説明</h2>
          {definition ? (
            <>
              <StatusBadge classification={classification} />
              <p>状態: {definition.state}</p>
              <p>想定アクション: {definition.action}</p>
            </>
          ) : (
            <p>未解析のため、分類説明はまだ表示できません。</p>
          )}
        </article>

        <article className="panel action-recommendation">
          <h2>推奨アクションカード</h2>
          <strong>{record.recommendedAction ?? 'モック解析を実行してください'}</strong>
          <p>{definition?.riskLabel ?? '未解析'}</p>
        </article>
      </section>

      <section className="panel memo-panel">
        <label>
          判断メモ
          <textarea
            onChange={(event) => setMemo(event.target.value)}
            placeholder="例: Lane 03周辺を再確認。A分類株は天敵散布の対象として検討。"
            value={memo}
          />
        </label>
        <div className="button-row">
          <button className="button button-primary" onClick={handleSave} type="button">
            判断を保存
          </button>
          <Link className="button button-secondary" to="/admin/heatmap">
            ヒートマップへ戻る
          </Link>
          <Link className="button button-ghost" to="/admin/analysis">
            一覧へ戻る
          </Link>
        </div>
        {message ? <p className="toast-message">{message}</p> : null}
      </section>
    </main>
  );
}
