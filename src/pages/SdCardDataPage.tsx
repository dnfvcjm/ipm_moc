import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import SummaryCard from '../components/SummaryCard';
import { AREA_COUNT } from '../data/appConfig';
import { getAreaInfoByPlantIndex } from '../utils/analysis';
import { formatDate, formatDateTime } from '../utils/format';
import { createDemoBatchIfNeeded, exportMockJson, getCaptureBatches, getPhotoRecords } from '../utils/storage';

export default function SdCardDataPage() {
  createDemoBatchIfNeeded();
  const batches = getCaptureBatches();
  const selectedBatch = batches[0];
  const photos = selectedBatch ? getPhotoRecords().filter((photo) => photo.batchId === selectedBatch.id) : [];

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(exportMockJson(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sd-card-mock-data.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="page-shell">
      <AppHeader current="SDカード保存データ" />
      <section className="page-header">
        <p className="eyebrow">SD Card Mock</p>
        <h1>SDカード保存データ</h1>
        <p className="lead">localStorage内の撮影データをSDカード保存Mockとして表示します。</p>
      </section>
      <section className="summary-grid">
        {batches.map((batch) => (
          <SummaryCard
            key={batch.id}
            note={`${batch.fieldId} / Lane ${batch.laneNo} / ${formatDate(new Date(batch.startedAt))}`}
            title={batch.id}
            value={`${batch.validPhotoCount}枚`}
            tone={batch.analysisStatus === '解析済み' ? 'good' : 'warning'}
          />
        ))}
      </section>
      {selectedBatch ? (
        <section className="panel">
          <h2>選択中バッチの詳細</h2>
          <dl className="meta-list stacked compact-meta">
            <div><dt>バッチID</dt><dd>{selectedBatch.id}</dd></div>
            <div><dt>撮影日</dt><dd>{formatDateTime(selectedBatch.startedAt)}</dd></div>
            <div><dt>解析ステータス</dt><dd>{selectedBatch.analysisStatus}</dd></div>
          </dl>
          <div className="area-count-grid">
            {Array.from({ length: AREA_COUNT }, (_, index) => {
              const area = getAreaInfoByPlantIndex(index * 3 + 1);
              const count = photos.filter((photo) => photo.areaId === area.areaId).length;
              return (
                <div className="area-count" key={area.areaId}>
                  <strong>{area.areaId}</strong>
                  <span>
                    Plant {String(area.areaStartPlant).padStart(3, '0')}-{String(area.areaEndPlant).padStart(3, '0')}
                  </span>
                  <em>{count}枚</em>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      <div className="button-row">
        <Link className="button button-primary" to="/analysis">未解析データ一覧へ</Link>
        <button className="button button-secondary" onClick={handleExport} type="button">Mock JSONを書き出し</button>
        <Link className="button button-ghost" to="/">ホームへ戻る</Link>
      </div>
    </main>
  );
}
