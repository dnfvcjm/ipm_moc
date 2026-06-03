import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AnalysisLoading from '../components/AnalysisLoading';
import AppHeader from '../components/AppHeader';
import SummaryCard from '../components/SummaryCard';
import UnanalyzedDataList from '../components/UnanalyzedDataList';
import { IMAGE_PATHS } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import type { CaptureBatch } from '../types';
import { aggregateAreaRisk, analyzePhotos } from '../utils/analysis';
import {
  createDemoBatchIfNeeded,
  getCaptureBatches,
  getPhotoRecords,
  saveAnalyzedBatch,
} from '../utils/storage';

const ANALYSIS_LOADING_MS = 1600;

const getBatchPhotos = (batchId: string) =>
  getPhotoRecords().filter((photo) => photo.batchId === batchId && photo.isValidForAnalysis);

const isAnalyzedBatch = (batchId: string) => {
  const photos = getBatchPhotos(batchId);
  return photos.length > 0 && photos.every((photo) => photo.riskScore !== undefined);
};

export default function AnalysisQueuePage() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [analyzingBatch, setAnalyzingBatch] = useState<CaptureBatch | null>(null);
  const analysisTimerRef = useRef<number | null>(null);

  createDemoBatchIfNeeded();
  const batches = getCaptureBatches();
  const photos = getPhotoRecords();
  const pendingBatches = batches.filter((batch) => !isAnalyzedBatch(batch.id));
  const unanalyzedPhotoCount = pendingBatches.reduce(
    (total, batch) => total + getBatchPhotos(batch.id).filter((photo) => photo.riskScore === undefined).length,
    0,
  );
  const analyzedPhotoCount = photos.filter((photo) => photo.riskScore !== undefined).length;

  useEffect(
    () => () => {
      if (analysisTimerRef.current !== null) {
        window.clearTimeout(analysisTimerRef.current);
      }
    },
    [],
  );

  const runMockAnalysisAndSave = (batchId: string) => {
    const targetBatch = getCaptureBatches().find((batch) => batch.id === batchId) ?? null;
    const targetPhotos = getPhotoRecords().filter(
      (photo) => photo.batchId === batchId && photo.isValidForAnalysis,
    );
    const analyzedPhotos = analyzePhotos(targetPhotos);
    const areaRiskSummaries = aggregateAreaRisk(analyzedPhotos);
    saveAnalyzedBatch(batchId, analyzedPhotos, areaRiskSummaries);

    return targetBatch;
  };

  const navigateToHeatmapAfterLoading = () => {
    if (analysisTimerRef.current !== null) {
      window.clearTimeout(analysisTimerRef.current);
    }

    analysisTimerRef.current = window.setTimeout(() => {
      navigate('/heatmap');
    }, ANALYSIS_LOADING_MS);
  };

  const handleAnalyze = (batchId: string) => {
    if (analyzingBatch) return;

    const targetBatch = runMockAnalysisAndSave(batchId);
    if (!targetBatch) return;

    setAnalyzingBatch(targetBatch);
    navigateToHeatmapAfterLoading();
  };

  if (analyzingBatch) {
    return (
      <main className="page-shell wide-page analysis-queue-page">
        <AppHeader current={t.analysisResult.currentLoading} />
        <AnalysisLoading batch={analyzingBatch} />
      </main>
    );
  }

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
