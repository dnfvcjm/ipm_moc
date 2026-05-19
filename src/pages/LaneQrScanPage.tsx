import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { TARGET_LANE_NO, TARGET_PLANT_COUNT } from '../data/appConfig';
import { startNewCaptureSession } from '../utils/storage';

export default function LaneQrScanPage() {
  const navigate = useNavigate();
  const [scanned, setScanned] = useState(false);

  const startCapture = () => {
    startNewCaptureSession();
    navigate('/capture');
  };

  return (
    <main className="page-shell narrow-page">
      <AppHeader current="レーンQR読取" />
      <section className="panel action-panel">
        <p className="eyebrow">Lane QR</p>
        <h1>レーンQR読取</h1>
        <p className="lead">レーン入口のQRコードを読み取ってください。</p>
        <div className="qr-mock">
          <div className="qr-grid" />
          <strong>QR Mock</strong>
        </div>
        {scanned ? (
          <div className="success-strip">
            読取成功: Lane {TARGET_LANE_NO} / 撮影株数 {TARGET_PLANT_COUNT}株
          </div>
        ) : null}
        <div className="button-row">
          <button className="button button-primary button-large" onClick={() => setScanned(true)} type="button">
            QR読取
          </button>
          {scanned ? (
            <button className="button button-secondary button-large" onClick={startCapture} type="button">
              撮影を開始
            </button>
          ) : null}
          <Link className="button button-ghost" to="/assignment">
            戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
