import { Link, useParams, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import AreaTrendChart from '../components/AreaTrendChart';
import PhotoPreviewMock from '../components/PhotoPreviewMock';
import RiskBadge from '../components/RiskBadge';
import SummaryCard from '../components/SummaryCard';
import { FIELD_ID, IMAGE_PATHS, TARGET_LANE_NO } from '../data/appConfig';
import { sampleTreatments } from '../data/sampleTreatments';
import { sampleWeeklyRisk } from '../data/sampleWeeklyRisk';
import { useI18n } from '../i18n/LanguageContext';
import { formatDate } from '../utils/format';
import { getCurrentAreaRiskSummaries, getPhotoRecords } from '../utils/storage';

const getSelectedSummary = (areaId: string, weekOffset: number) => {
  const current = getCurrentAreaRiskSummaries();
  if (weekOffset === 0) {
    const currentSummary = current.find((summary) => summary.areaId === areaId && summary.validPhotoCount > 0);
    if (currentSummary) return currentSummary;
  }
  return sampleWeeklyRisk.find((summary) => summary.areaId === areaId && summary.weekOffset === weekOffset)
    ?? sampleWeeklyRisk.find((summary) => summary.areaId === areaId && summary.weekOffset === 0);
};

export default function AreaDetailPage() {
  const { riskLabel, riskPolicy, t, treatmentNote, weekLabel } = useI18n();
  const { areaId = 'Area 10' } = useParams();
  const decodedAreaId = decodeURIComponent(areaId);
  const [searchParams] = useSearchParams();
  const weekOffset = Number(searchParams.get('week') ?? 0);
  const summary = getSelectedSummary(decodedAreaId, weekOffset);
  const trendSummaries = sampleWeeklyRisk
    .filter((item) => item.areaId === decodedAreaId)
    .sort((a, b) => a.weekOffset - b.weekOffset);
  const treatments = sampleTreatments.filter((treatment) => treatment.areaId === decodedAreaId);
  const areaPhotos = getPhotoRecords().filter((photo) => photo.areaId === decodedAreaId && photo.isValidForAnalysis);
  const representativePhoto = areaPhotos.find((photo) => photo.processedImagePath) ?? areaPhotos[0];

  if (!summary) {
    return (
      <main className="page-shell narrow-page">
        <AppHeader current={t.areaDetail.current} />
        <section className="panel action-panel">
          <h1>{t.areaDetail.notFoundTitle}</h1>
          <Link className="button button-primary" to="/heatmap">{t.common.backToHeatmap}</Link>
        </section>
      </main>
    );
  }

  const problemRate = `${Math.round(summary.problemRatio * 100)}%`;

  return (
    <main className="page-shell wide-page">
      <AppHeader current={t.areaDetail.current} />
      <section className="page-header">
        <p className="eyebrow">Area Detail</p>
        <h1>{t.areaDetail.title}</h1>
        <p className="lead">{FIELD_ID} / Lane {TARGET_LANE_NO} / {summary.areaId} / {weekLabel(summary.weekOffset)}</p>
      </section>

      <section className="detail-grid">
        <article className="panel target-panel">
          <h2>{t.areaDetail.basicInfo}</h2>
          <dl className="meta-list stacked">
            <div><dt>{t.common.fieldId}</dt><dd>{summary.fieldId}</dd></div>
            <div><dt>{t.common.laneNo}</dt><dd>Lane {summary.laneNo}</dd></div>
            <div><dt>Area ID</dt><dd>{summary.areaId}</dd></div>
            <div><dt>{t.areaDetail.targetPlantRange}</dt><dd>Plant {String(summary.areaStartPlant).padStart(3, '0')}-{String(summary.areaEndPlant).padStart(3, '0')}</dd></div>
            <div><dt>{t.areaDetail.selectedWeek}</dt><dd>{weekLabel(summary.weekOffset)}</dd></div>
          </dl>
        </article>
        <article className="panel action-recommendation">
          <h2>{t.areaDetail.policyTitle}</h2>
          <RiskBadge grade={summary.areaRiskGrade} label={`${summary.areaRiskGrade}: ${riskLabel(summary.areaRiskGrade)}`} />
          <strong>{riskPolicy(summary.areaRiskGrade)}</strong>
          <p>{t.areaDetail.recommendedBottles}: {summary.recommendedBottleCount} {t.common.bottles}</p>
          <p className="note-text">{t.common.finalDecisionNote}</p>
        </article>
      </section>

      <section className="summary-grid">
        <SummaryCard title={t.areaDetail.validTotal} value={summary.validPhotoCount} />
        <SummaryCard title={t.areaDetail.problemPhotos} value={summary.problemPhotoCount} tone={summary.problemPhotoCount > 0 ? 'warning' : 'good'} />
        <SummaryCard title={t.areaDetail.problemRatio} value={problemRate} tone={summary.problemRatio > 0 ? 'warning' : 'good'} />
        <SummaryCard title={t.areaDetail.riskScore} value={summary.areaRiskScore} tone={summary.areaRiskGrade === 'A' ? 'danger' : 'default'} />
      </section>

      <section className="panel image-compare-panel">
        <h2>{t.areaDetail.imagesTitle}</h2>
        <div className="image-compare">
          <PhotoPreviewMock
            imagePath={representativePhoto?.sourceImagePath ?? IMAGE_PATHS.original}
            title={t.areaDetail.sourceImage}
            note={t.areaDetail.sourceImageNote}
          />
          <PhotoPreviewMock
            imagePath={representativePhoto?.processedImagePath ?? IMAGE_PATHS.spectral}
            title={t.areaDetail.spectralImage}
            note={t.areaDetail.spectralImageNote}
          />
        </div>
      </section>

      <section className="detail-grid">
        <article className="panel">
          <h2>{t.areaDetail.treatments}</h2>
          {treatments.length > 0 ? (
            <div className="table-scroll">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>{t.areaDetail.treatedAt}</th>
                    <th>{t.areaDetail.bottleCount}</th>
                    <th>{t.areaDetail.treatmentNote}</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((treatment) => (
                    <tr key={treatment.id}>
                      <td>{formatDate(new Date(treatment.treatedAt))}</td>
                      <td>{treatment.bottleCount} {t.common.bottles}</td>
                      <td>{treatmentNote(treatment.note)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="note-text">{t.areaDetail.noTreatments}</p>
          )}
        </article>
        <article className="panel">
          <h2>{t.areaDetail.trendTitle}</h2>
          <AreaTrendChart areaId={summary.areaId} summaries={trendSummaries} />
        </article>
      </section>

      <div className="button-row">
        <Link className="button button-primary" to="/heatmap">{t.common.backToHeatmap}</Link>
        <Link className="button button-secondary" to="/timeline-heatmap">{t.areaDetail.backToTimeline}</Link>
      </div>
    </main>
  );
}
