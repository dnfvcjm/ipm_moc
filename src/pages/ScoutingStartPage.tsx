import { Link, useNavigate } from 'react-router-dom';
import { CAPTURED_BY, FIELD_ID, TARGET_LANES } from '../data/appConfig';

export default function ScoutingStartPage() {
  const navigate = useNavigate();

  return (
    <main className="page-shell narrow-page">
      <section className="panel action-panel">
        <p className="eyebrow">S-01</p>
        <h1>Scouting開始</h1>
        <p className="lead">対象レーンへ移動し、中段付近の葉をスペクトルカメラで撮影します。</p>

        <dl className="meta-list stacked">
          <div>
            <dt>今日の圃場</dt>
            <dd>{FIELD_ID}</dd>
          </div>
          <div>
            <dt>対象レーン</dt>
            <dd>{TARGET_LANES}</dd>
          </div>
          <div>
            <dt>作業者</dt>
            <dd>{CAPTURED_BY}</dd>
          </div>
        </dl>

        <div className="button-row">
          <button className="button button-primary button-large" onClick={() => navigate('/scouting/input')} type="button">
            Start
          </button>
          <Link className="button button-ghost" to="/">
            ホームへ戻る
          </Link>
        </div>
      </section>
    </main>
  );
}
