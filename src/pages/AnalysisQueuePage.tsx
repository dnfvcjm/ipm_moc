import { Link, useNavigate } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import SummaryCard from '../components/SummaryCard';
import UnanalyzedDataList from '../components/UnanalyzedDataList';
import { IMAGE_PATHS } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import {
  createDemoBatchIfNeeded,
  getCaptureBatches,
  getPhotoRecords,
} from '../utils/storage';

const getBatchPhotos = (batchId: string) =>
  getPhotoRecords().filter((photo) => photo.batchId === batchId && photo.isValidForAnalysis);

const isAnalyzedBatch = (batchId: string) => {
  const photos = getBatchPhotos(batchId);
  return photos.length > 0 && photos.every((photo) => photo.riskScore !== undefined);
};

export default function AnalysisQueuePage() {
  const navigate = useNavigate();
  const { t } = useI18n();

  createDemoBatchIfNeeded();
  const batches = getCaptureBatches();
  const photos = getPhotoRecords();
  const pendingBatches = batches.filter((batch) => !isAnalyzedBatch(batch.id));
  const unanalyzedPhotoCount = pendingBatches.reduce(
    (total, batch) => total + getBatchPhotos(batch.id).filter((photo) => photo.riskScore === undefined).length,
    0,
  );
  const analyzedPhotoCount = photos.filter((photo) => photo.riskScore !== undefined).length;

  const handleAnalyze = (batchId: string) => {
    navigate(`/analysis/${encodeURIComponent(batchId)}`);
  };

  return (
    <main className="page-shell wide-page analysis-queue-page">
      <AppHeader current={t.analysisQueue.current} />
      <section className="page-header">
        <p className="eyebrow">Analysis Queue</p>
        <h1>{t.analysisQueue.title}</h1>
        <p className="lead">
          {t.analysisQueue.lead}
        </p>
      </section>

      <section className="summary-grid">
        <SummaryCard title={t.analysisQueue.pendingBatchCount} value={pendingBatches.length} tone="warning" />
        <SummaryCard title={t.analysisQueue.pendingPhotoCount} value={unanalyzedPhotoCount} />
        <SummaryCard title={t.analysisQueue.analyzedPhotoCount} value={analyzedPhotoCount} tone="good" />
        <SummaryCard title={t.analysisQueue.analysisTarget} value={`${t.common.tomato} / ${t.common.leaf}`} tone="info" />
      </section>

      <UnanalyzedDataList
        batches={pendingBatches.length > 0 ? pendingBatches : batches}
        onAnalyze={handleAnalyze}
        photos={photos}
        thumbnailPath={IMAGE_PATHS.original}
      />

      <div className="button-row">
        {pendingBatches.length > 0 ? (
          <button
            className="button button-primary"
            onClick={() => handleAnalyze(pendingBatches[0].id)}
            type="button"
          >
            {t.analysisQueue.firstAnalyze}
          </button>
        ) : (
          <Link className="button button-primary" to="/heatmap">
            {t.analysisQueue.viewHeatmap}
          </Link>
        )}
        <Link className="button button-ghost" to="/">
          {t.common.backHome}
        </Link>
      </div>
    </main>
  );
}
