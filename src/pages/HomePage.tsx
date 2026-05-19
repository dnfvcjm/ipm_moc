import { Link } from 'react-router-dom';
import { FIELD_ID, TARGET_LANES } from '../data/appConfig';
import { formatDate } from '../utils/format';

const steps = [
  { title: '撮影', text: 'レーンと株を選び、葉をスペクトルカメラで撮影' },
  { title: '保存', text: '撮影日時・位置・画像IDを記録' },
  { title: '解析', text: '未解析データにモック分類とリスクスコアを付与' },
  { title: '分類 / Heatmap', text: 'A/B/C/Zと圃場グリッドで判断を支援' },
];

export default function HomePage() {
  return (
    <main className="page-shell home-page">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Field Experience Mock</p>
          <h1>DN IPM Spectral Scouting Mock</h1>
          <p className="lead">スペクトルカメラ撮影と病害予兆確認の体験モック</p>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" to="/scouting/start">
            Scoutingを開始
          </Link>
          <Link className="button button-secondary" to="/admin">
            解析結果を確認
          </Link>
        </div>
      </section>

      <section className="info-grid">
        <div className="panel target-panel">
          <h2>今日の対象圃場</h2>
          <dl className="meta-list">
            <div>
              <dt>圃場ID</dt>
              <dd>{FIELD_ID}</dd>
            </div>
            <div>
              <dt>日付</dt>
              <dd>{formatDate()}</dd>
            </div>
            <div>
              <dt>対象エリア</dt>
              <dd>{TARGET_LANES}</dd>
            </div>
          </dl>
        </div>

        <div className="flow-grid">
          {steps.map((step, index) => (
            <article className="flow-card" key={step.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
