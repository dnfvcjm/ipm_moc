import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import LanguageToggle from '../components/LanguageToggle';
import { FIELD_ID, SHOOTING_POSITION, TARGET_LANE_NO, TARGET_PLANT_COUNT } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <main className="page-shell">
      <AppHeader current={t.home.current} />
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{t.home.eyebrow}</p>
          <h1>{t.common.appName}</h1>
          <p className="lead">{t.home.subtitle}</p>
          <LanguageToggle />
        </div>
        <div className="hero-actions">
          <Link className="button button-primary button-large" to="/assignment">
            {t.home.confirmField}
          </Link>
          <Link className="button button-secondary button-large" to="/analysis">
            {t.home.viewAnalysis}
          </Link>
        </div>
      </section>

      <section className="info-grid">
        <article className="panel target-panel">
          <h2>{t.home.todayTarget}</h2>
          <dl className="meta-list stacked">
            <div>
              <dt>{t.common.fieldId}</dt>
              <dd>{FIELD_ID}</dd>
            </div>
            <div>
              <dt>{t.common.targetLane}</dt>
              <dd>Lane {TARGET_LANE_NO}</dd>
            </div>
            <div>
              <dt>{t.home.targetPlantCount}</dt>
              <dd>{TARGET_PLANT_COUNT} {t.common.plants}</dd>
            </div>
            <div>
              <dt>{t.assignment.shootingPosition}</dt>
              <dd>{t.common.shootingPosition || SHOOTING_POSITION}</dd>
            </div>
          </dl>
        </article>
        <div className="flow-grid dense">
          {t.home.cards.map((card, index) => (
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
