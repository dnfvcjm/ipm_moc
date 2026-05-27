import type { CaptureBatch, PhotoRecord } from '../types';
import { useI18n } from '../i18n/LanguageContext';
import { formatDateTime } from '../utils/format';

type UnanalyzedDataListProps = {
  batches: CaptureBatch[];
  photos: PhotoRecord[];
  thumbnailPath: string;
  onAnalyze: (batchId: string) => void;
};

const getBatchPhotos = (photos: PhotoRecord[], batchId: string) =>
  photos.filter((photo) => photo.batchId === batchId && photo.isValidForAnalysis);

const isBatchAnalyzed = (photos: PhotoRecord[], batchId: string) => {
  const batchPhotos = getBatchPhotos(photos, batchId);
  return batchPhotos.length > 0 && batchPhotos.every((photo) => photo.riskScore !== undefined);
};

export default function UnanalyzedDataList({
  batches,
  photos,
  thumbnailPath,
  onAnalyze,
}: UnanalyzedDataListProps) {
  const { t } = useI18n();

  if (batches.length === 0) {
    return (
      <section className="panel empty-state-panel">
        <h2>{t.analysisQueue.noDataTitle}</h2>
        <p>{t.analysisQueue.noDataLead}</p>
      </section>
    );
  }

  return (
    <section className="unanalyzed-list" aria-label={t.analysisQueue.title}>
      {batches.map((batch) => {
        const batchPhotos = getBatchPhotos(photos, batch.id);
        const analyzed = isBatchAnalyzed(photos, batch.id);

        return (
          <article className="unanalyzed-card" key={batch.id}>
            <div className="unanalyzed-thumb">
              <img alt={t.analysisResult.beforeLabel} src={thumbnailPath} />
              <span>{t.analysisQueue.thumbnailLabel}</span>
            </div>
            <div className="unanalyzed-body">
              <div className="unanalyzed-card-head">
                <div>
                  <p className="eyebrow">{t.analysisQueue.targetEyebrow}</p>
                  <h2>{batch.id}</h2>
                </div>
                <span className={`analysis-status-pill ${analyzed ? 'is-done' : 'is-pending'}`}>
                  {analyzed ? t.common.analyzed : t.common.unanalyzed}
                </span>
              </div>
              <dl className="mini-meta-grid">
                <div>
                  <dt>{t.analysisQueue.capturedAt}</dt>
                  <dd>{formatDateTime(batch.completedAt ?? batch.startedAt)}</dd>
                </div>
                <div>
                  <dt>{t.analysisQueue.cropName}</dt>
                  <dd>{t.common.tomato}</dd>
                </div>
                <div>
                  <dt>{t.analysisQueue.captureTarget}</dt>
                  <dd>{t.common.leaf}</dd>
                </div>
                <div>
                  <dt>{t.common.validPhotoCount}</dt>
                  <dd>{batchPhotos.length} {t.common.photos}</dd>
                </div>
              </dl>
              <p className="note-text">
                {t.analysisQueue.note}
              </p>
              <div className="button-row">
                <button
                  className="button button-primary"
                  onClick={() => onAnalyze(batch.id)}
                  type="button"
                >
                  {t.analysisQueue.analyze}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
