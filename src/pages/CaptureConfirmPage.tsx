import { useLocation, useNavigate } from 'react-router-dom';
import { CAPTURED_BY, FIELD_ID } from '../data/appConfig';
import type { CaptureDraft, ScoutingRecord } from '../types';
import { createImageId, formatDateTime } from '../utils/format';
import { saveScoutingRecord } from '../utils/storage';

type LocationState = {
  draft?: CaptureDraft;
};

const createFallbackDraft = (): CaptureDraft => {
  const capturedAt = new Date();
  return {
    fieldId: FIELD_ID,
    laneNo: '03',
    plantNo: '012',
    capturedAt: capturedAt.toISOString(),
    capturedBy: CAPTURED_BY,
    imageId: createImageId(capturedAt),
  };
};

export default function CaptureConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const draft = state?.draft ?? createFallbackDraft();

  const handleSave = () => {
    const record: ScoutingRecord = {
      id: `local-${draft.imageId}-${Date.now()}`,
      ...draft,
      analysisStatus: '未解析',
    };

    saveScoutingRecord(record);
    navigate('/scouting/saved', { state: { record } });
  };

  return (
    <main className="page-shell capture-page">
      <section className="panel">
        <p className="eyebrow">S-04</p>
        <h1>撮影完了</h1>
        <div className="success-strip">撮影が完了しました</div>

        <div className="confirm-layout">
          <div className="mock-image">
            <div className="spectral-bars">
              <span />
              <span />
              <span />
              <span />
            </div>
            <p>Mock Spectral Preview</p>
          </div>

          <div className="panel-subtle">
            <h2>保存前確認</h2>
            <dl className="meta-list stacked">
              <div>
                <dt>圃場ID</dt>
                <dd>{draft.fieldId}</dd>
              </div>
              <div>
                <dt>レーンNo</dt>
                <dd>{draft.laneNo}</dd>
              </div>
              <div>
                <dt>株No</dt>
                <dd>{draft.plantNo}</dd>
              </div>
              <div>
                <dt>撮影日時</dt>
                <dd>{formatDateTime(draft.capturedAt)}</dd>
              </div>
              <div>
                <dt>撮影者</dt>
                <dd>{draft.capturedBy}</dd>
              </div>
              <div>
                <dt>ダミー画像ID</dt>
                <dd>{draft.imageId}</dd>
              </div>
            </dl>
            <p className="note-text">画像プレビューはモックです。実装時はスペクトルカメラ画像と接続します。</p>
          </div>
        </div>

        <div className="button-row">
          <button className="button button-primary button-large" onClick={handleSave} type="button">
            保存
          </button>
          <button
            className="button button-secondary"
            onClick={() =>
              navigate('/scouting/capture', {
                state: { laneNo: draft.laneNo, plantNo: draft.plantNo },
              })
            }
            type="button"
          >
            再撮影
          </button>
        </div>
      </section>
    </main>
  );
}
