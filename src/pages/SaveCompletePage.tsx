import { Link, useLocation, useNavigate } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import type { ScoutingRecord } from '../types';
import { formatDateTime, nextPlantNo } from '../utils/format';
import { getStoredRecords } from '../utils/storage';

type LocationState = {
  record?: ScoutingRecord;
};

export default function SaveCompletePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const record = state?.record ?? getStoredRecords()[0];

  if (!record) {
    return (
      <main className="page-shell narrow-page">
        <section className="panel action-panel">
          <h1>保存データがありません</h1>
          <Link className="button button-primary" to="/scouting/input">
            撮影入力へ
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell narrow-page">
      <section className="panel action-panel">
        <p className="eyebrow">S-05</p>
        <h1>保存完了</h1>
        <div className="success-strip">撮影データを保存しました</div>

        <dl className="meta-list stacked save-meta">
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
            <dt>画像ID</dt>
            <dd>{record.imageId}</dd>
          </div>
          <div>
            <dt>解析ステータス</dt>
            <dd>
              <StatusBadge status={record.analysisStatus} />
            </dd>
          </div>
        </dl>

        <div className="button-row vertical-actions">
          <button
            className="button button-primary"
            onClick={() =>
              navigate('/scouting/input', {
                state: { laneNo: record.laneNo, plantNo: nextPlantNo(record.plantNo) },
              })
            }
            type="button"
          >
            次の株へ
          </button>
          <Link className="button button-secondary" to="/">
            ホームへ戻る
          </Link>
          <Link className="button button-ghost" to="/admin/analysis">
            解析結果を見る
          </Link>
        </div>
      </section>
    </main>
  );
}
