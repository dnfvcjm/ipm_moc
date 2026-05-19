import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import SummaryCard from '../components/SummaryCard';
import { aggregateAreaRisk, analyzePhotos } from '../utils/analysis';
import {
  createDemoBatchIfNeeded,
  getCaptureBatches,
  getPhotoRecords,
  saveAnalyzedBatch,
} from '../utils/storage';

export default function AnalysisQueuePage() {
  createDemoBatchIfNeeded();
  const batches = getCaptureBatches();
  const photos = getPhotoRecords();
  const pendingBatches = batches.filter((batch) => batch.analysisStatus === '未解析');
  const analyzedPhotos = photos.filter((photo) => photo.riskScore !== undefined).length;

  const handleAnalyze = () => {
    pendingBatches.forEach((batch) => {
      const batchPhotos = photos.filter((photo) => photo.batchId === batch.id && photo.isValidForAnalysis);
      const analyzed = analyzePhotos(batchPhotos);
      const areaRisk = aggregateAreaRisk(analyzed);
      saveAnalyzedBatch(batch.id, analyzed, areaRisk);
    });
    window.location.reload();
  };

  return (
    <main className="page-shell">
      <AppHeader current="未解析データ一覧" />
      <section className="page-header">
        <p className="eyebrow">Analysis Queue</p>
        <h1>未解析データ一覧</h1>
        <p className="lead">SDカードMock上の未解析バッチに疑似解析を実行します。</p>
      </section>
      <section className="summary-grid">
        <SummaryCard title="未解析バッチ数" value={pendingBatches.length} tone="warning" />
        <SummaryCard title="未解析写真数" value={photos.filter((photo) => photo.riskScore === undefined).length} />
        <SummaryCard title="解析済み写真数" value={analyzedPhotos} tone="good" />
      </section>
      <section className="panel table-panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>バッチID</th>
                <th>圃場ID</th>
                <th>レーン番号</th>
                <th>有効写真数</th>
                <th>解析ステータス</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch) => (
                <tr key={batch.id}>
                  <td>{batch.id}</td>
                  <td>{batch.fieldId}</td>
                  <td>Lane {batch.laneNo}</td>
                  <td>{batch.validPhotoCount}</td>
                  <td>{batch.analysisStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <div className="button-row">
        <button className="button button-primary" disabled={pendingBatches.length === 0} onClick={handleAnalyze} type="button">
          未解析データを解析
        </button>
        <Link className="button button-secondary" to="/heatmap">Heatmapを見る</Link>
        <Link className="button button-ghost" to="/">戻る</Link>
      </div>
    </main>
  );
}
