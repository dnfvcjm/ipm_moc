import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import { sampleAssignment } from '../data/sampleAssignment';

const notes = [
  '高所台車に乗った状態で撮影',
  '隣の株へは足操作で移動',
  '1株につき最低1枚撮影',
  'ピンボケ時は再撮影',
];

export default function FieldAssignmentPage() {
  return (
    <main className="page-shell narrow-page">
      <AppHeader current="今日の対象圃場" />
      <section className="panel action-panel">
        <p className="eyebrow">Assignment</p>
        <h1>今日の対象圃場</h1>
        <dl className="meta-list stacked">
          <div>
            <dt>圃場ID</dt>
            <dd>{sampleAssignment.fieldId}</dd>
          </div>
          <div>
            <dt>圃場名</dt>
            <dd>{sampleAssignment.fieldName}</dd>
          </div>
          <div>
            <dt>対象レーン</dt>
            <dd>Lane {sampleAssignment.laneNo}</dd>
          </div>
          <div>
            <dt>撮影対象</dt>
            <dd>1レーン{sampleAssignment.targetPlantCount}株</dd>
          </div>
          <div>
            <dt>撮影位置</dt>
            <dd>{sampleAssignment.shootingPosition}</dd>
          </div>
        </dl>
        <ul className="check-list">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
        <div className="button-row">
          <Link className="button button-primary button-large" to="/lane-qr">
            レーン入口へ移動した
          </Link>
          <Link className="button button-ghost" to="/">
            ホームへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
