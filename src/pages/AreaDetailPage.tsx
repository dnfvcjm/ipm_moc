import { Link, useParams, useSearchParams } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import AreaTrendChart from '../components/AreaTrendChart';
import PhotoPreviewMock from '../components/PhotoPreviewMock';
import RiskBadge from '../components/RiskBadge';
import SummaryCard from '../components/SummaryCard';
import { FIELD_ID, IMAGE_PATHS, TARGET_LANE_NO } from '../data/appConfig';
import { sampleTreatments } from '../data/sampleTreatments';
import { sampleWeeklyRisk } from '../data/sampleWeeklyRisk';
import { classificationDefinitions } from '../utils/analysis';
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
        <AppHeader current="エリア詳細" />
        <section className="panel action-panel">
          <h1>エリア情報がありません</h1>
          <Link className="button button-primary" to="/heatmap">Heatmapへ戻る</Link>
        </section>
      </main>
    );
  }

  const definition = classificationDefinitions[summary.areaRiskGrade];
  const problemRate = `${Math.round(summary.problemRatio * 100)}%`;

  return (
    <main className="page-shell wide-page">
      <AppHeader current="エリア詳細" />
      <section className="page-header">
        <p className="eyebrow">Area Detail</p>
        <h1>エリア詳細</h1>
        <p className="lead">{FIELD_ID} / Lane {TARGET_LANE_NO} / {summary.areaId} / {summary.weekLabel}</p>
      </section>

      <section className="detail-grid">
        <article className="panel target-panel">
          <h2>基本情報</h2>
          <dl className="meta-list stacked">
            <div><dt>圃場ID</dt><dd>{summary.fieldId}</dd></div>
            <div><dt>レーン番号</dt><dd>Lane {summary.laneNo}</dd></div>
            <div><dt>Area ID</dt><dd>{summary.areaId}</dd></div>
            <div><dt>対象Plant範囲</dt><dd>Plant {String(summary.areaStartPlant).padStart(3, '0')}-{String(summary.areaEndPlant).padStart(3, '0')}</dd></div>
            <div><dt>選択週</dt><dd>{summary.weekLabel}</dd></div>
          </dl>
        </article>
        <article className="panel action-recommendation">
          <h2>局所対応方針</h2>
          <RiskBadge grade={summary.areaRiskGrade} label={`${summary.areaRiskGrade}: ${definition.riskLabel}`} />
          <strong>{summary.recommendedPolicy}</strong>
          <p>推奨ボトル数: {summary.recommendedBottleCount}本</p>
          <p className="note-text">推奨であり、最終判断は管理者が行います。</p>
        </article>
      </section>

      <section className="summary-grid">
        <SummaryCard title="有効写真総数" value={summary.validPhotoCount} />
        <SummaryCard title="問題写真数" value={summary.problemPhotoCount} tone={summary.problemPhotoCount > 0 ? 'warning' : 'good'} />
        <SummaryCard title="問題写真率" value={problemRate} tone={summary.problemRatio > 0 ? 'warning' : 'good'} />
        <SummaryCard title="リスクスコア" value={summary.areaRiskScore} tone={summary.areaRiskGrade === 'A' ? 'danger' : 'default'} />
      </section>

      <section className="panel image-compare-panel">
        <h2>元画像・スペクトル画像</h2>
        <div className="image-compare">
          <PhotoPreviewMock
            imagePath={representativePhoto?.sourceImagePath ?? IMAGE_PATHS.original}
            title="元画像"
            note="撮影確認に使う通常画像Mock"
          />
          <PhotoPreviewMock
            imagePath={representativePhoto?.processedImagePath ?? IMAGE_PATHS.spectral}
            title="スペクトル画像"
            note="解析後イメージMock"
          />
        </div>
      </section>

      <section className="detail-grid">
        <article className="panel">
          <h2>防除記録</h2>
          {treatments.length > 0 ? (
            <div className="table-scroll">
              <table className="compact-table">
                <thead>
                  <tr>
                    <th>対応日</th>
                    <th>投入ボトル数</th>
                    <th>対応メモ</th>
                  </tr>
                </thead>
                <tbody>
                  {treatments.map((treatment) => (
                    <tr key={treatment.id}>
                      <td>{formatDate(new Date(treatment.treatedAt))}</td>
                      <td>{treatment.bottleCount}本</td>
                      <td>{treatment.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="note-text">このエリアの防除記録サンプルはありません。</p>
          )}
        </article>
        <article className="panel">
          <h2>リスクグレードとボトル数の時系列</h2>
          <AreaTrendChart areaId={summary.areaId} summaries={trendSummaries} />
        </article>
      </section>

      <div className="button-row">
        <Link className="button button-primary" to="/heatmap">Heatmapへ戻る</Link>
        <Link className="button button-secondary" to="/timeline-heatmap">時間軸Heatmapへ戻る</Link>
      </div>
    </main>
  );
}
