import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import PhotoPreviewMock from '../components/PhotoPreviewMock';
import { IMAGE_PATHS, TARGET_PLANT_COUNT } from '../data/appConfig';
import { getAreaInfoByPlantIndex } from '../utils/analysis';
import { formatDateTime } from '../utils/format';
import {
  completeCaptureBatch,
  getCaptureSession,
  getPendingCapture,
  incrementRetakeForPlant,
  saveCaptureSession,
  saveValidPhoto,
} from '../utils/storage';

export default function BlurCheckPage() {
  const navigate = useNavigate();
  const session = getCaptureSession();
  const pending = getPendingCapture();

  if (!session || !pending) {
    return (
      <main className="page-shell narrow-page">
        <AppHeader current="ピンボケ確認" />
        <section className="panel action-panel">
          <h1>確認対象の撮影がありません</h1>
          <Link className="button button-primary" to="/capture">
            撮影へ戻る
          </Link>
        </section>
      </main>
    );
  }

  const areaInfo = getAreaInfoByPlantIndex(pending.plantIndex);
  const isBlurred = pending.photoQuality === 'blurred';

  const handleSave = () => {
    if (isBlurred) return;
    saveValidPhoto(session, pending);

    if (pending.plantIndex >= TARGET_PLANT_COUNT) {
      completeCaptureBatch(session);
      navigate('/lane-complete');
      return;
    }

    saveCaptureSession({ ...session, currentPlantIndex: pending.plantIndex + 1 });
    navigate('/capture');
  };

  const handleRetake = () => {
    incrementRetakeForPlant(pending.plantIndex);
    navigate('/capture');
  };

  return (
    <main className="page-shell capture-page">
      <AppHeader current="ピンボケ確認" />
      <section className="panel">
        <p className="eyebrow">Quality Check</p>
        <h1>ピンボケ確認</h1>
        <div className={isBlurred ? 'warning-strip' : 'success-strip'}>
          {isBlurred ? 'ピンボケしているため再撮影が必要です' : '撮影画像を確認してください'}
        </div>
        <div className="confirm-layout">
          <PhotoPreviewMock
            imagePath={isBlurred ? IMAGE_PATHS.blurred : IMAGE_PATHS.original}
            isBlurred={isBlurred}
            title={isBlurred ? 'ピンボケ元画像' : '元画像'}
          />
          <div className="panel-subtle">
            <h2>メタデータ</h2>
            <dl className="meta-list stacked">
              <div><dt>圃場ID</dt><dd>{session.fieldId}</dd></div>
              <div><dt>レーン番号</dt><dd>Lane {session.laneNo}</dd></div>
              <div><dt>Plant Index</dt><dd>Plant {String(pending.plantIndex).padStart(3, '0')}</dd></div>
              <div><dt>Area ID</dt><dd>{areaInfo.areaId}</dd></div>
              <div><dt>撮影日時</dt><dd>{formatDateTime(pending.capturedAt)}</dd></div>
              <div><dt>画像ID</dt><dd>{pending.imageId}</dd></div>
            </dl>
            <p className="note-text">写真がピンボケしていないか確認してください。ピンボケ写真は解析対象に含めません。</p>
          </div>
        </div>
        <div className="button-row">
          <button className="button button-primary button-large" disabled={isBlurred} onClick={handleSave} type="button">
            問題なし・保存
          </button>
          <button className="button button-danger button-large" onClick={handleRetake} type="button">
            ピンボケ・再撮影
          </button>
        </div>
      </section>
    </main>
  );
}
