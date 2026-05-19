import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { FIELD_ID, SHOOTING_POSITION, TARGET_LANE_NO, TARGET_PLANT_COUNT } from '../data/appConfig';

const cards = [
  '圃場確認',
  'レーンQR',
  '80株撮影',
  'ピンボケ確認',
  'SDカード保存',
  '解析',
  '5mエリアHeatmap',
  '防除効果確認',
];

export default function HomePage() {
  return (
    <main className="page-shell">
      <AppHeader current="ホーム" />
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Field Scouting Mock</p>
          <h1>DN IPM Spectral Scouting Mock</h1>
          <p className="lead">レーン撮影・SDカード保存・エリア別リスク可視化モック</p>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary button-large" to="/assignment">
            今日の圃場を確認
          </Link>
          <Link className="button button-secondary button-large" to="/analysis">
            解析・Heatmapを見る
          </Link>
        </div>
      </section>

      <section className="info-grid">
        <article className="panel target-panel">
          <h2>今日の対象</h2>
          <dl className="meta-list stacked">
            <div>
              <dt>圃場ID</dt>
              <dd>{FIELD_ID}</dd>
            </div>
            <div>
              <dt>対象レーン</dt>
              <dd>Lane {TARGET_LANE_NO}</dd>
            </div>
            <div>
              <dt>撮影株数</dt>
              <dd>{TARGET_PLANT_COUNT}株</dd>
            </div>
            <div>
              <dt>撮影位置</dt>
              <dd>{SHOOTING_POSITION}</dd>
            </div>
          </dl>
        </article>
        <div className="flow-grid dense">
          {cards.map((card, index) => (
            <article className="flow-card" key={card}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{card}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
