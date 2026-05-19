import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CAPTURED_BY, FIELD_ID } from '../data/appConfig';
import type { CaptureDraft } from '../types';
import { createImageId } from '../utils/format';

type LocationState = {
  laneNo?: string;
  plantNo?: string;
};

const guideItems = [
  '中段付近の葉を撮影してください',
  '葉の表面が画面中央に入るようにしてください',
  'カメラとの距離を一定にしてください',
  '強い逆光を避けてください',
];

export default function CaptureGuidePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const laneNo = state?.laneNo ?? '03';
  const plantNo = state?.plantNo ?? '012';
  const [isCapturing, setIsCapturing] = useState(false);

  const handleCapture = () => {
    setIsCapturing(true);
    window.setTimeout(() => {
      const capturedAt = new Date();
      const draft: CaptureDraft = {
        fieldId: FIELD_ID,
        laneNo,
        plantNo,
        capturedAt: capturedAt.toISOString(),
        capturedBy: CAPTURED_BY,
        imageId: createImageId(capturedAt),
      };

      navigate('/scouting/confirm', { state: { draft } });
    }, 1000);
  };

  return (
    <main className="page-shell capture-page">
      <section className="panel">
        <div className="capture-header">
          <div>
            <p className="eyebrow">S-03</p>
            <h1>撮影ガイド</h1>
          </div>
          <div className="location-chip">
            Lane {laneNo} / Plant {plantNo}
          </div>
        </div>

        <div className="capture-layout">
          <div className="camera-preview" aria-label="カメラプレビュー風の枠">
            <div className="leaf-placeholder">
              <span className="leaf-main" />
              <span className="leaf-side" />
            </div>
            <div className="guide-frame" />
            {isCapturing ? <div className="capture-overlay">撮影中...</div> : null}
          </div>

          <aside className="guide-panel">
            <h2>撮影時の確認</h2>
            <ul className="check-list">
              {guideItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="button-row">
          <button
            className="button button-primary button-large"
            disabled={isCapturing}
            onClick={handleCapture}
            type="button"
          >
            {isCapturing ? 'Capturing...' : '撮影'}
          </button>
          <button
            className="button button-ghost"
            disabled={isCapturing}
            onClick={() => navigate('/scouting/input', { state: { laneNo, plantNo } })}
            type="button"
          >
            戻る
          </button>
        </div>
      </section>
    </main>
  );
}
