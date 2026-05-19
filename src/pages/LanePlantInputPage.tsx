import { FormEvent, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { normalizeLaneNo, normalizePlantNo } from '../utils/format';

type LocationState = {
  laneNo?: string;
  plantNo?: string;
};

export default function LanePlantInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [laneNo, setLaneNo] = useState(state?.laneNo ?? '03');
  const [plantNo, setPlantNo] = useState(state?.plantNo ?? '012');
  const [error, setError] = useState('');

  const handleQrRead = () => {
    setLaneNo('03');
    setPlantNo('012');
    setError('');
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!laneNo.trim() || !plantNo.trim()) {
      setError('レーンNoと株Noを入力してください。');
      return;
    }

    navigate('/scouting/capture', {
      state: {
        laneNo: normalizeLaneNo(laneNo),
        plantNo: normalizePlantNo(plantNo),
      },
    });
  };

  return (
    <main className="page-shell narrow-page">
      <section className="panel action-panel">
        <p className="eyebrow">S-02</p>
        <h1>レーン・株番号入力</h1>
        <p className="lead">撮影画像に紐づける位置メタデータを入力します。</p>

        <form className="input-form" onSubmit={handleSubmit}>
          <label>
            レーンNo
            <input
              inputMode="numeric"
              onChange={(event) => setLaneNo(event.target.value)}
              placeholder="03"
              value={laneNo}
            />
          </label>
          <label>
            株No
            <input
              inputMode="numeric"
              onChange={(event) => setPlantNo(event.target.value)}
              placeholder="012"
              value={plantNo}
            />
          </label>

          {error ? <p className="error-text">{error}</p> : null}

          <div className="button-row">
            <button className="button button-secondary" onClick={handleQrRead} type="button">
              QR読取
            </button>
            <button className="button button-primary" type="submit">
              次へ
            </button>
            <button className="button button-ghost" onClick={() => navigate('/scouting/start')} type="button">
              戻る
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
