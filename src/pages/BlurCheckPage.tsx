import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import PhotoPreviewMock from '../components/PhotoPreviewMock';
import { IMAGE_PATHS, TARGET_PLANT_COUNT } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
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
  const { t } = useI18n();
  const session = getCaptureSession();
  const pending = getPendingCapture();

  if (!session || !pending) {
    return (
      <main className="page-shell narrow-page">
        <AppHeader current={t.blurCheck.current} />
        <section className="panel action-panel">
          <h1>{t.blurCheck.noCaptureTitle}</h1>
          <Link className="button button-primary" to="/capture">
            {t.blurCheck.backToCapture}
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
      <AppHeader current={t.blurCheck.current} />
      <section className="panel">
        <p className="eyebrow">{t.blurCheck.eyebrow}</p>
        <h1>{t.blurCheck.title}</h1>
        <div className={isBlurred ? 'warning-strip' : 'success-strip'}>
          {isBlurred ? t.blurCheck.blurredWarning : t.blurCheck.clearMessage}
        </div>
        <div className="confirm-layout">
          <PhotoPreviewMock
            imagePath={isBlurred ? IMAGE_PATHS.blurred : IMAGE_PATHS.original}
            isBlurred={isBlurred}
            title={t.blurCheck.previewTitle}
            note={t.blurCheck.previewNote}
          />
          <div className="panel-subtle">
            <h2>{t.common.metadata}</h2>
            <dl className="meta-list stacked">
              <div><dt>{t.common.fieldId}</dt><dd>{session.fieldId}</dd></div>
              <div><dt>{t.common.laneNo}</dt><dd>Lane {session.laneNo}</dd></div>
              <div><dt>Plant Index</dt><dd>Plant {String(pending.plantIndex).padStart(3, '0')}</dd></div>
              <div><dt>Area ID</dt><dd>{areaInfo.areaId}</dd></div>
              <div><dt>{t.common.capturedAt}</dt><dd>{formatDateTime(pending.capturedAt)}</dd></div>
              <div><dt>{t.common.imageId}</dt><dd>{pending.imageId}</dd></div>
            </dl>
            <p className="note-text">
              {t.blurCheck.note}
            </p>
          </div>
        </div>
        <div className="button-row">
          <button className="button button-primary button-large" disabled={isBlurred} onClick={handleSave} type="button">
            {t.blurCheck.save}
          </button>
          <button className="button button-danger button-large" onClick={handleRetake} type="button">
            {t.blurCheck.retake}
          </button>
        </div>
      </section>
    </main>
  );
}
