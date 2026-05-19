import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import PhotoPreviewMock from '../components/PhotoPreviewMock';
import ProgressBar from '../components/ProgressBar';
import SummaryCard from '../components/SummaryCard';
import { IMAGE_PATHS, STORAGE_LABEL, TARGET_PLANT_COUNT } from '../data/appConfig';
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
    }, 650);
  };

  const handlePause = () => {
    saveCaptureSession(session);
    setSavedMessage('撮影セッションを一時保存しました');
  };

  return (
    <main className="page-shell capture-page">
      <AppHeader current="撮影セッション" />
      <section className="page-header">
        <p className="eyebrow">Capture Session</p>
        <h1>Lane {session.laneNo} 撮影セッション</h1>
        <p className="lead">Plant Indexはアプリが自動進行します。株番号の手入力はありません。</p>
      </section>

      <section className="summary-grid">
        <SummaryCard title="有効写真数" value={validPhotoCount} note="解析対象" tone="good" />
        <SummaryCard title="再撮影回数" value={session.totalBlurredRetakeCount} tone="warning" />
        <SummaryCard
          title="現在のArea"
          value={areaInfo.areaId}
          note={`Plant ${String(areaInfo.areaStartPlant).padStart(3, '0')}-${String(areaInfo.areaEndPlant).padStart(3, '0')}`}
        />
        <SummaryCard title="保存先" value={STORAGE_LABEL} tone="info" />
      </section>

      <section className="panel">
        <ProgressBar current={plantIndex} total={TARGET_PLANT_COUNT} />
        <div className="capture-layout">
          <PhotoPreviewMock
            imagePath={isBlurred ? IMAGE_PATHS.blurred : IMAGE_PATHS.original}
            isBlurred={isBlurred}
            note={isBlurred ? 'このPlantは初回のみピンボケMockが出ます' : '撮影プレビューMock'}
            title="元画像プレビュー"
          />
          <aside className="guide-panel">
            <h2>撮影ガイド</h2>
            <ul className="check-list">
              <li>成長点の1段下の葉を撮影してください</li>
              <li>葉が画面中央に入るようにしてください</li>
              <li>ピンボケしないように距離を一定にしてください</li>
              <li>撮影後、高所台車の足操作で隣の株へ移動してください</li>
            </ul>
            {pending ? <p className="note-text">未確認の撮影があります。ピンボケ確認へ進んでください。</p> : null}
          </aside>
        </div>
        {savedMessage ? <div className="toast-message">{savedMessage}</div> : null}
        <div className="button-row">
          <button className="button button-primary button-large" disabled={isCapturing} onClick={handleCapture} type="button">
            {isCapturing ? '撮影中...' : '撮影する'}
          </button>
          <button className="button button-secondary" onClick={handlePause} type="button">
            一時保存して中断
          </button>
          <Link className="button button-ghost" to="/">
            ホームへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
