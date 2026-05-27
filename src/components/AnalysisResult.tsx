import { Link } from 'react-router-dom';
import { useI18n } from '../i18n/LanguageContext';
import type { CaptureBatch, PhotoRecord } from '../types';
import BeforeAfterComparison from './BeforeAfterComparison';

type AnalysisResultProps = {
  batch: CaptureBatch;
  samplePhoto?: PhotoRecord | null;
  beforeImagePath: string;
  afterImagePath: string;
};

export default function AnalysisResult({
  batch,
  samplePhoto,
  beforeImagePath,
  afterImagePath,
}: AnalysisResultProps) {
  const { t } = useI18n();

  return (
    <>
      <section className="page-header analysis-result-header">
        <p className="eyebrow">Analysis Result</p>
        <h1>{t.analysisResult.title}</h1>
        <p className="lead">
          {t.analysisResult.lead}
        </p>
      </section>

      <BeforeAfterComparison beforeImagePath={beforeImagePath} afterImagePath={afterImagePath} />

      <section className="result-card-grid">
        <article className="panel result-detection-card">
          <span>{t.analysisResult.detectionItem}</span>
          <strong>{t.analysisResult.microSpots}</strong>
          <p>{t.analysisResult.detectionItemNote}</p>
        </article>
        <article className="panel result-detection-card">
          <span>{t.analysisResult.estimatedCause}</span>
          <strong>{t.analysisResult.suckingDamage}</strong>
          <p>{t.analysisResult.estimatedCauseNote}</p>
        </article>
        <article className="panel result-detection-card">
          <span>{t.analysisResult.detectionStatus}</span>
          <strong>{t.analysisResult.needsReview}</strong>
          <p>{t.analysisResult.detectionStatusNote}</p>
        </article>
      </section>

      <section className="panel analysis-result-summary">
        <dl className="mini-meta-grid">
          <div>
            <dt>{t.analysisResult.batch}</dt>
            <dd>{batch.id}</dd>
          </div>
          <div>
            <dt>{t.analysisResult.targetPhoto}</dt>
            <dd>{samplePhoto?.imageId ?? 'IMG-MOCK-001'}</dd>
          </div>
          <div>
            <dt>{t.analysisResult.estimatedClass}</dt>
            <dd>{samplePhoto?.classification ?? 'B'} / {t.analysisResult.needsReview}</dd>
          </div>
          <div>
            <dt>{t.analysisResult.processedImage}</dt>
            <dd>{samplePhoto?.processedImageId ?? 'SPC-MOCK-001'}</dd>
          </div>
        </dl>
        <p className="note-text">
          {t.analysisResult.mockNote}
        </p>
      </section>

      <div className="button-row analysis-result-actions">
        <Link className="button button-primary button-large" to="/heatmap">
          {t.analysisResult.viewHeatmap}
        </Link>
        <Link className="button button-ghost" to="/analysis">
          {t.analysisResult.backToQueue}
        </Link>
      </div>
    </>
  );
}
