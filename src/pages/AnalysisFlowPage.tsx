import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AnalysisLoading from '../components/AnalysisLoading';
import AnalysisResult from '../components/AnalysisResult';
import AppHeader from '../components/AppHeader';
import { useI18n } from '../i18n/LanguageContext';
import type { CaptureBatch, PhotoRecord } from '../types';
import { aggregateAreaRisk, analyzePhotos } from '../utils/analysis';
import {
  createDemoBatchIfNeeded,
  getCaptureBatches,
  getPhotoRecords,
  saveAnalyzedBatch,
} from '../utils/storage';

const SPECTRAL_ANALYSIS_IMAGE = '/images/c033f113-f253-474d-be29-944804835778.png';
const ANALYSIS_BEFORE_IMAGE = '/images/AdobeStock_159772561-768x512.jpeg';

const findBatch = (batchId?: string) => {
  createDemoBatchIfNeeded();
  const decodedId = batchId ? decodeURIComponent(batchId) : '';
  const batches = getCaptureBatches();
  return batches.find((batch) => batch.id === decodedId) ?? batches[0] ?? null;
};

const findRepresentativePhoto = (batchId: string) => {
  const photos = getPhotoRecords().filter(
    (photo) => photo.batchId === batchId && photo.isValidForAnalysis,
  );

  return (
    photos.find((photo) => photo.classification === 'A' || photo.classification === 'B') ??
    photos.find((photo) => photo.riskScore !== undefined) ??
    photos[0] ??
    null
  );
};

export default function AnalysisFlowPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const [phase, setPhase] = useState<'loading' | 'result'>('loading');
  const [batch, setBatch] = useState<CaptureBatch | null>(() => findBatch(id));
  const [samplePhoto, setSamplePhoto] = useState<PhotoRecord | null>(() =>
    batch ? findRepresentativePhoto(batch.id) : null,
  );

  useEffect(() => {
    const targetBatch = findBatch(id);

    if (!targetBatch) {
      navigate('/analysis', { replace: true });
      return undefined;
    }

    setBatch(targetBatch);
    setSamplePhoto(findRepresentativePhoto(targetBatch.id));
    setPhase('loading');

    const timer = window.setTimeout(() => {
      const batchPhotos = getPhotoRecords().filter(
        (photo) => photo.batchId === targetBatch.id && photo.isValidForAnalysis,
      );
      const analyzedPhotos = analyzePhotos(batchPhotos).map((photo) => ({
        ...photo,
        processedImagePath: SPECTRAL_ANALYSIS_IMAGE,
        processedImageId: photo.processedImageId ?? `SPC-${photo.imageId}`,
      }));
      const areaRiskSummaries = aggregateAreaRisk(analyzedPhotos);

      saveAnalyzedBatch(targetBatch.id, analyzedPhotos, areaRiskSummaries);

      const updatedBatch =
        getCaptureBatches().find((item) => item.id === targetBatch.id) ?? targetBatch;
      setBatch(updatedBatch);
      setSamplePhoto(
        analyzedPhotos.find((photo) => photo.classification === 'A' || photo.classification === 'B') ??
          analyzedPhotos[0] ??
          null,
      );
      setPhase('result');
    }, 1600);

    return () => window.clearTimeout(timer);
  }, [id, navigate]);

  return (
    <main className="page-shell wide-page">
      <AppHeader current={phase === 'loading' ? t.analysisResult.currentLoading : t.analysisResult.currentResult} />
      {batch ? (
        phase === 'loading' ? (
          <AnalysisLoading batch={batch} />
        ) : (
          <AnalysisResult
            afterImagePath={SPECTRAL_ANALYSIS_IMAGE}
            batch={batch}
            beforeImagePath={ANALYSIS_BEFORE_IMAGE}
            samplePhoto={samplePhoto}
          />
        )
      ) : (
        <section className="panel">
          <h1>{t.analysisResult.notFoundTitle}</h1>
          <p className="lead">{t.analysisResult.notFoundLead}</p>
        </section>
      )}
    </main>
  );
}
