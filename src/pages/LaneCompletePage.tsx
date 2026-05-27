import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import SummaryCard from '../components/SummaryCard';
import { AREA_COUNT, TARGET_PLANT_COUNT } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import { getAreaInfoByPlantIndex } from '../utils/analysis';
import { formatDateTime } from '../utils/format';
import { getCaptureBatches, getPhotoRecords } from '../utils/storage';

export default function LaneCompletePage() {
  const { statusLabel, t } = useI18n();
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
      <AppHeader current={t.laneComplete.current} />
      <section className="page-header">
        <p className="eyebrow">Lane Complete</p>
        <h1>{t.laneComplete.title}</h1>
        <p className="lead">
          {isComplete ? t.laneComplete.completeLead : t.laneComplete.incompleteLead}
        </p>
      </section>
      {batch ? (
        <>
          <section className="summary-grid">
            <SummaryCard title={t.common.fieldId} value={batch.fieldId} />
            <SummaryCard title={t.common.laneNo} value={`Lane ${batch.laneNo}`} />
            <SummaryCard title={t.common.validPhotoCount} value={`${batch.validPhotoCount} ${t.common.photos}`} tone={isComplete ? 'good' : 'warning'} />
            <SummaryCard title={t.laneComplete.blurredRetakes} value={batch.blurredRetakeCount} tone="warning" />
            <SummaryCard title={t.laneComplete.startedAt} value={formatDateTime(batch.startedAt)} />
            <SummaryCard title={t.laneComplete.completedAt} value={batch.completedAt ? formatDateTime(batch.completedAt) : '-'} />
            <SummaryCard title={t.common.storage} value={t.common.sdCardMock} tone="info" />
            <SummaryCard title={t.common.analysisStatus} value={statusLabel(batch.analysisStatus)} tone="warning" />
          </section>
          <section className="panel">
            <h2>{t.laneComplete.areaSummary}</h2>
            <div className="area-count-grid">
              {areaCounts.map((area) => (
                <div className="area-count" key={area.areaId}>
                  <strong>{area.areaId}</strong>
                  <span>
                    Plant {String(area.areaStartPlant).padStart(3, '0')}-{String(area.areaEndPlant).padStart(3, '0')}
                  </span>
                  <em>{area.count} {t.common.photos}</em>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="panel">
          <p>{t.laneComplete.noBatch}</p>
        </section>
      )}
      <div className="button-row">
        <Link className="button button-primary" to="/sd-card">{t.laneComplete.viewSdCard}</Link>
        <Link className="button button-secondary" to="/analysis">{t.laneComplete.goAnalysis}</Link>
        <Link className="button button-ghost" to="/">{t.common.backHome}</Link>
      </div>
    </main>
  );
}
