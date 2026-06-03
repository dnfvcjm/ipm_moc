import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import CameraLivePreview from '../components/CameraLivePreview';
import { IMAGE_PATHS, TARGET_PLANT_COUNT } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import { getAreaInfoByPlantIndex, shouldShowBlurredImage } from '../utils/analysis';
import {
  createImageId,
  getCaptureSession,
  saveCaptureSession,
  savePendingCapture,
  startNewCaptureSession,
} from '../utils/storage';

type CaptureView = 'guide' | 'camera';

const getGuideAccepted = (batchId: string) => {
  if (typeof window === 'undefined') return false;
  return window.sessionStorage.getItem(`dn-ipm-guide-accepted:${batchId}`) === 'true';
};

const setGuideAccepted = (batchId: string) => {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(`dn-ipm-guide-accepted:${batchId}`, 'true');
};

export default function CaptureSessionPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [isCapturing, setIsCapturing] = useState(false);
  const session = getCaptureSession() ?? startNewCaptureSession();
  const [captureView, setCaptureView] = useState<CaptureView>(() =>
    getGuideAccepted(session.batchId) ? 'camera' : 'guide',
  );
  const plantIndex = session.currentPlantIndex;
  const areaInfo = useMemo(() => getAreaInfoByPlantIndex(plantIndex), [plantIndex]);
  const isBlurred = shouldShowBlurredImage(
    plantIndex,
    session.retakeCountByPlant,
    session.blurredPlantIndexes,
  );

  const handleStartCamera = () => {
    setGuideAccepted(session.batchId);
    setCaptureView('camera');
  };

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

  if (captureView === 'guide') {
    return (
      <main className="page-shell narrow-page capture-guide-start-page">
        <AppHeader current={t.capture.guideTitle} />
        <section className="panel action-panel capture-guide-start">
          <p className="eyebrow">{t.capture.eyebrow}</p>
          <h1>{t.capture.guideTitle}</h1>
          <p className="lead">{t.capture.guideLead}</p>
          <dl className="meta-list stacked">
            <div>
              <dt>{t.common.laneNo}</dt>
              <dd>Lane {session.laneNo}</dd>
            </div>
            <div>
              <dt>Plant Index</dt>
              <dd>Plant {String(plantIndex).padStart(3, '0')} / {String(TARGET_PLANT_COUNT).padStart(3, '0')}</dd>
            </div>
            <div>
              <dt>Area ID</dt>
              <dd>{areaInfo.areaId}</dd>
            </div>
          </dl>
          <ul className="check-list">
            {t.capture.guide.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="button-row">
            <button className="button button-primary button-large" onClick={handleStartCamera} type="button">
              {t.capture.startCamera}
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="live-camera-page">
      <CameraLivePreview
        imagePath={isBlurred ? IMAGE_PATHS.blurred : IMAGE_PATHS.original}
        isBlurred={isBlurred}
        isCapturing={isCapturing}
        plantIndex={plantIndex}
      />
      <button
        aria-label={t.capture.shutterAria}
        className="live-camera-shutter"
        disabled={isCapturing}
        onClick={handleCapture}
        type="button"
      >
        <span className="camera-button-icon" aria-hidden="true" />
        <strong>{isCapturing ? t.capture.capturing : t.capture.shutter}</strong>
      </button>
    </main>
  );
}
