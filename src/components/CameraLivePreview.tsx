import { useI18n } from '../i18n/LanguageContext';
import TomatoLeafPreview from './TomatoLeafPreview';

type CameraLivePreviewProps = {
  imagePath: string;
  isCapturing: boolean;
  isBlurred?: boolean;
  plantIndex: number;
};

export default function CameraLivePreview({
  imagePath,
  isCapturing,
  isBlurred = false,
  plantIndex,
}: CameraLivePreviewProps) {
  const { t } = useI18n();

  return (
    <div className={`camera-live-preview ${isCapturing ? 'is-capturing' : ''} ${isBlurred ? 'is-defocused' : ''}`}>
      <div className="camera-guide-text">{t.capture.cameraGuide}</div>
      <div className="camera-status-bar">
        <span className="record-dot" />
        <strong>LIVE CAMERA</strong>
        <em>Plant {String(plantIndex).padStart(3, '0')}</em>
      </div>
      <TomatoLeafPreview fallbackSrc={imagePath} isBlurred={isBlurred} />
      <div className="camera-vignette" />
      <div className="focus-reticle">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="scan-line" />
      <div className="camera-bottom-bar">
        <span>AF LOCK</span>
        <span>{t.capture.distance}</span>
        <span>{t.capture.exposureAuto}</span>
      </div>
      {isCapturing ? (
        <div className="shutter-overlay">
          <strong>{t.capture.capturing}</strong>
        </div>
      ) : null}
    </div>
  );
}
