import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { sampleAssignment } from '../data/sampleAssignment';
import { useI18n } from '../i18n/LanguageContext';

export default function FieldAssignmentPage() {
  const { t } = useI18n();

  return (
    <main className="page-shell narrow-page">
      <AppHeader current={t.assignment.current} />
      <section className="panel action-panel">
        <p className="eyebrow">Assignment</p>
        <h1>{t.assignment.title}</h1>
        <dl className="meta-list stacked">
          <div>
            <dt>{t.common.fieldId}</dt>
            <dd>{sampleAssignment.fieldId}</dd>
          </div>
          <div>
            <dt>{t.assignment.fieldName}</dt>
            <dd>{t.common.fieldName}</dd>
          </div>
          <div>
            <dt>{t.common.targetLane}</dt>
            <dd>Lane {sampleAssignment.laneNo}</dd>
          </div>
          <div>
            <dt>{t.assignment.captureTarget}</dt>
            <dd>1 Lane / {sampleAssignment.targetPlantCount} {t.common.plants}</dd>
          </div>
          <div>
            <dt>{t.assignment.shootingPosition}</dt>
            <dd>{t.common.shootingPosition}</dd>
          </div>
        </dl>
        <ul className="check-list">
          {t.assignment.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <div className="button-row">
          <Link className="button button-primary button-large" to="/lane-qr">
            {t.assignment.moveToLane}
          </Link>
          <Link className="button button-ghost" to="/">
            {t.common.backHome}
          </Link>
        </div>
      </section>
    </main>
  );
}
