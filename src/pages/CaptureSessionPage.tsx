import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import CameraLivePreview from '../components/CameraLivePreview';
import ProgressBar from '../components/ProgressBar';
import SummaryCard from '../components/SummaryCard';
import { IMAGE_PATHS, STORAGE_LABEL, TARGET_PLANT_COUNT } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import { getAreaInfoByPlantIndex, shouldShowBlurredImage } from '../utils/analysis';
import {
  createImageId,
  getCaptureSession,
  getPendingCapture,
  getValidPhotosByBatch,
  saveCaptureSession,
  savePendingCapture,
  startNewCaptureSession,
} from '../utils/storage';

export default function CaptureSessionPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isCapturing, setIsCapturing] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');
  const session = getCaptureSession() ?? startNewCaptureSession();
  const plantIndex = session.currentPlantIndex;
  const areaInfo = useMemo(() => getAreaInfoByPlantIndex(plantIndex), [plantIndex]);
  const validPhotoCount = getValidPhotosByBatch(session.batchId).length;
  const isBlurred = shouldShowBlurredImage(
    plantIndex,
    session.retakeCountByPlant,
    session.blurredPlantIndexes,
  );
  const pending = getPendingCapture();

  const handleCapture = () => {
    setIsCapturing(true);
    window.setTimeout(() => {
      saveCaptureSession(session);
      savePendingCapture({
        batchId: session.batchId,
        plantIndex,
        capturedAt: new Date().toISOString(),
        imageId: createImageId(plantIndex),
        photoQuality: isBlurred ? 'blurred' : 'clear',
      });
      setIsCapturing(false);
      navigate('/blur-check');
    }, 850);
  };

  const handlePause = () => {
    saveCaptureSession(session);
    setSavedMessage(t.capture.pauseSaved);
  };

  return (
    <main className="page-shell capture-page">
      <AppHeader current={t.capture.current} />
      <section className="page-header">
        <p className="eyebrow">{t.capture.eyebrow}</p>
        <h1>Lane {session.laneNo} {t.capture.titleSuffix}</h1>
        <p className="lead">
          {t.capture.lead}
        </p>
      </section>

      <section className="summary-grid">
        <SummaryCard title={t.capture.validPhotos} value={validPhotoCount} note={t.capture.analysisTarget} tone="good" />
        <SummaryCard title={t.capture.retakes} value={session.totalBlurredRetakeCount} tone="warning" />
        <SummaryCard
          title={t.capture.currentArea}
          value={areaInfo.areaId}
          note={`Plant ${String(areaInfo.areaStartPlant).padStart(3, '0')}-${String(areaInfo.areaEndPlant).padStart(3, '0')}`}
        />
        <SummaryCard title={t.capture.storage} value={t.common.sdCardMock || STORAGE_LABEL} tone="info" />
      </section>

      <section className="panel">
        <ProgressBar current={plantIndex} total={TARGET_PLANT_COUNT} />
        <div className="capture-layout">
          <CameraLivePreview
            imagePath={isBlurred ? IMAGE_PATHS.blurred : IMAGE_PATHS.original}
            isBlurred={isBlurred}
            isCapturing={isCapturing}
            plantIndex={plantIndex}
          />
          <aside className="guide-panel">
            <h2>{t.capture.guideTitle}</h2>
            <ul className="check-list">
              {t.capture.guide.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            {pending ? <p className="note-text">{t.capture.pendingNotice}</p> : null}
          </aside>
        </div>
        {savedMessage ? <div className="toast-message">{savedMessage}</div> : null}
        <div className="button-row">
          <button
            className="button button-primary button-large capture-shutter-action"
            disabled={isCapturing}
            onClick={handleCapture}
            type="button"
          >
            {isCapturing ? t.capture.capturing : t.capture.shutter}
          </button>
          <button className="button button-secondary" onClick={handlePause} type="button">
            {t.capture.pause}
          </button>
          <Link className="button button-ghost" to="/">
            {t.common.backHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
