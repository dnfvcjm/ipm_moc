import type { CaptureBatch } from '../types';
import { useI18n } from '../i18n/LanguageContext';

type AnalysisLoadingProps = {
  batch: CaptureBatch;
};

export default function AnalysisLoading({ batch }: AnalysisLoadingProps) {
  const { t } = useI18n();

  return (
    <section className="analysis-loading-card">
      <div className="analysis-spinner" aria-hidden="true" />
      <div>
        <p className="eyebrow">{t.analysisLoading.eyebrow}</p>
        <h1>{t.analysisLoading.title}</h1>
        <p className="lead">{t.analysisLoading.lead}</p>
      </div>
      <div className="analysis-progress" aria-label={t.analysisLoading.progressAria}>
        <span className="analysis-progress-fill" />
      </div>
      <ul className="analysis-steps">
        <li>{t.analysisLoading.batch}: {batch.id}</li>
        {t.analysisLoading.steps.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ul>
    </section>
  );
}
