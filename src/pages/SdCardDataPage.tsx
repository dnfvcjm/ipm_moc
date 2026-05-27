import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import SummaryCard from '../components/SummaryCard';
import { AREA_COUNT } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import { getAreaInfoByPlantIndex } from '../utils/analysis';
import { formatDate, formatDateTime } from '../utils/format';
import { createDemoBatchIfNeeded, exportMockJson, getCaptureBatches, getPhotoRecords } from '../utils/storage';

export default function SdCardDataPage() {
  const { statusLabel, t } = useI18n();
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
      <AppHeader current={t.sdCard.current} />
      <section className="page-header">
        <p className="eyebrow">SD Card Mock</p>
        <h1>{t.sdCard.title}</h1>
        <p className="lead">{t.sdCard.lead}</p>
      </section>
      <section className="summary-grid">
        {batches.map((batch) => (
          <SummaryCard
            key={batch.id}
            note={`${batch.fieldId} / Lane ${batch.laneNo} / ${formatDate(new Date(batch.startedAt))}`}
            title={batch.id}
            value={`${batch.validPhotoCount} ${t.common.photos}`}
            tone={statusLabel(batch.analysisStatus) === t.common.analyzed ? 'good' : 'warning'}
          />
        ))}
      </section>
      {selectedBatch ? (
        <section className="panel">
          <h2>{t.sdCard.selectedBatch}</h2>
          <dl className="meta-list stacked compact-meta">
            <div><dt>Batch ID</dt><dd>{selectedBatch.id}</dd></div>
            <div><dt>{t.sdCard.capturedDate}</dt><dd>{formatDateTime(selectedBatch.startedAt)}</dd></div>
            <div><dt>{t.common.analysisStatus}</dt><dd>{statusLabel(selectedBatch.analysisStatus)}</dd></div>
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
                  <em>{count} {t.common.photos}</em>
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      <div className="button-row">
        <Link className="button button-primary" to="/analysis">{t.sdCard.toAnalysis}</Link>
        <button className="button button-secondary" onClick={handleExport} type="button">{t.sdCard.exportJson}</button>
        <Link className="button button-ghost" to="/">{t.common.backHome}</Link>
      </div>
    </main>
  );
}
