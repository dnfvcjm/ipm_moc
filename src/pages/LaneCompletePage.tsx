import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import SummaryCard from '../components/SummaryCard';
import { AREA_COUNT, TARGET_PLANT_COUNT } from '../data/appConfig';
import { getAreaInfoByPlantIndex } from '../utils/analysis';
import { formatDateTime } from '../utils/format';
import { getCaptureBatches, getPhotoRecords } from '../utils/storage';

export default function LaneCompletePage() {
  const batch = getCaptureBatches()[0];
  const photos = batch ? getPhotoRecords().filter((photo) => photo.batchId === batch.id) : [];
  const areaCounts = Array.from({ length: AREA_COUNT }, (_, index) => {
    const area = getAreaInfoByPlantIndex(index * 3 + 1);
    return {
      ...area,
      count: photos.filter((photo) => photo.areaId === area.areaId && photo.isValidForAnalysis).length,
    };
  });
  const isComplete = batch ? batch.validPhotoCount >= TARGET_PLANT_COUNT : false;

  return (
    <main className="page-shell">
      <AppHeader current="撮影完了" />
      <section className="page-header">
        <p className="eyebrow">Lane Complete</p>
        <h1>Lane 03 撮影完了</h1>
        <p className="lead">
          {isComplete ? '80株分の有効写真を保存しました。' : '有効写真が80枚未満のため、完了扱いではありません。'}
        </p>
      </section>
      {batch ? (
        <>
          <section className="summary-grid">
            <SummaryCard title="圃場ID" value={batch.fieldId} />
            <SummaryCard title="レーン番号" value={`Lane ${batch.laneNo}`} />
            <SummaryCard title="有効写真数" value={`${batch.validPhotoCount}枚`} tone={isComplete ? 'good' : 'warning'} />
            <SummaryCard title="ピンボケ再撮影回数" value={batch.blurredRetakeCount} tone="warning" />
            <SummaryCard title="撮影開始時刻" value={formatDateTime(batch.startedAt)} />
            <SummaryCard title="撮影終了時刻" value={batch.completedAt ? formatDateTime(batch.completedAt) : '-'} />
            <SummaryCard title="保存先" value={batch.storageLabel} tone="info" />
            <SummaryCard title="解析ステータス" value={batch.analysisStatus} tone="warning" />
          </section>
          <section className="panel">
            <h2>エリア分割サマリー</h2>
            <div className="area-count-grid">
              {areaCounts.map((area) => (
                <div className="area-count" key={area.areaId}>
                  <strong>{area.areaId}</strong>
                  <span>
                    Plant {String(area.areaStartPlant).padStart(3, '0')}-{String(area.areaEndPlant).padStart(3, '0')}
                  </span>
                  <em>{area.count}枚</em>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="panel">
          <p>保存済みバッチがありません。</p>
        </section>
      )}
      <div className="button-row">
        <Link className="button button-primary" to="/sd-card">SDカード保存データを見る</Link>
        <Link className="button button-secondary" to="/analysis">解析へ進む</Link>
        <Link className="button button-ghost" to="/">ホームへ戻る</Link>
      </div>
    </main>
  );
}
