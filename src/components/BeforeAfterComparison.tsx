import { useI18n } from '../i18n/LanguageContext';

type BeforeAfterComparisonProps = {
  beforeImagePath: string;
  afterImagePath: string;
};

const markers = [
  { top: '34%', left: '32%' },
  { top: '48%', left: '58%' },
  { top: '64%', left: '43%' },
  { top: '40%', left: '73%' },
];

export default function BeforeAfterComparison({
  beforeImagePath,
  afterImagePath,
}: BeforeAfterComparisonProps) {
  const { t } = useI18n();

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
          {markers.map((marker, index) => (
            <span
              aria-label={t.analysisResult.markerLabels[index]}
              className="analysis-marker"
              key={t.analysisResult.markerLabels[index]}
              style={{ left: marker.left, top: marker.top }}
              title={t.analysisResult.markerLabels[index]}
            />
          ))}
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
