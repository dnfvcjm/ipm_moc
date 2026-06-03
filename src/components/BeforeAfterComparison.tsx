import { useI18n } from '../i18n/LanguageContext';
import SpectralMarkerOverlay from './SpectralMarkerOverlay';
import { getSpectralDetectionMarkers } from '../utils/spectralMarkers';

type BeforeAfterComparisonProps = {
  beforeImagePath: string;
  afterImagePath: string;
};

export default function BeforeAfterComparison({
  beforeImagePath,
  afterImagePath,
}: BeforeAfterComparisonProps) {
  const { t } = useI18n();
  const markers = getSpectralDetectionMarkers({
    grade: 'B',
    problemRatio: 0.5,
    riskScore: 68,
    seed: 'analysis-result-preview',
  });

  return (
    <section className="before-after-grid" aria-label={t.analysisResult.beforeAfterAria}>
      <article className="analysis-image-card">
        <div className="analysis-image-card-head">
          <span>{t.analysisResult.before}</span>
          <strong>{t.analysisResult.beforeLabel}</strong>
        </div>
        <figure className="analysis-image-wrap">
          <img alt={t.analysisResult.beforeLabel} src={beforeImagePath} />
        </figure>
        <p>{t.analysisResult.beforeNote}</p>
      </article>

      <article className="analysis-image-card">
        <div className="analysis-image-card-head">
          <span>{t.analysisResult.after}</span>
          <strong>{t.analysisResult.afterLabel}</strong>
        </div>
        <figure className="analysis-image-wrap spectral-wrap">
          <img
            alt={t.analysisResult.afterLabel}
            className="spectral-analysis-image"
            src={afterImagePath}
          />
          <SpectralMarkerOverlay label={t.analysisResult.afterLabel} markers={markers} />
        </figure>
        <div className="analysis-annotations">
          {t.analysisResult.annotations.map((annotation) => (
            <span key={annotation}>{annotation}</span>
          ))}
        </div>
      </article>
    </section>
  );
}
