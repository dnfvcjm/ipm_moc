import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { TARGET_LANE_NO, TARGET_PLANT_COUNT } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import { startNewCaptureSession } from '../utils/storage';

export default function LaneQrScanPage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [scanned, setScanned] = useState(false);

  const startCapture = () => {
    startNewCaptureSession();
    navigate('/capture');
  };

  return (
    <main className="page-shell narrow-page">
      <AppHeader current={t.laneQr.current} />
      <section className="panel action-panel">
        <p className="eyebrow">Lane QR</p>
        <h1>{t.laneQr.title}</h1>
        <p className="lead">{t.laneQr.lead}</p>
        <div className="qr-mock">
          <div className="qr-grid" />
          <strong>{t.laneQr.qrMock}</strong>
        </div>
        {scanned ? (
          <div className="success-strip">
            {t.laneQr.success}: Lane {TARGET_LANE_NO} / {t.laneQr.capturePlantCount} {TARGET_PLANT_COUNT} {t.common.plants}
          </div>
        ) : null}
        <div className="button-row">
          <button className="button button-primary button-large" onClick={() => setScanned(true)} type="button">
            {t.laneQr.scan}
          </button>
          {scanned ? (
            <button className="button button-secondary button-large" onClick={startCapture} type="button">
              {t.laneQr.startCapture}
            </button>
          ) : null}
          <Link className="button button-ghost" to="/assignment">
            {t.common.back}
          </Link>
        </div>
      </section>
    </main>
  );
}
