import { LANE_NUMBERS, PLANT_NUMBERS } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import type { ScoutingRecord } from '../types';

type HeatmapGridProps = {
  records: ScoutingRecord[];
  onCellClick: (record: ScoutingRecord) => void;
};

const selectDisplayRecords = (records: ScoutingRecord[]) => {
  const map = new Map<string, ScoutingRecord>();

  records.forEach((record) => {
    const key = `${record.laneNo}-${record.plantNo}`;
    const current = map.get(key);
    if (!current) {
      map.set(key, record);
      return;
    }

    const currentScore = current.riskScore ?? -1;
    const nextScore = record.riskScore ?? -1;
    if (nextScore > currentScore || record.capturedAt > current.capturedAt) {
      map.set(key, record);
    }
  });

  return map;
};

export default function HeatmapGrid({ records, onCellClick }: HeatmapGridProps) {
  const { t } = useI18n();
  const displayRecords = selectDisplayRecords(records);

  return (
    <div className="heatmap-grid" aria-label={t.heatmap.title}>
      <div className="heatmap-header">
        <span>Lane</span>
        {PLANT_NUMBERS.map((plantNo) => (
          <span key={plantNo}>{Number(plantNo)}</span>
        ))}
      </div>

      {LANE_NUMBERS.map((laneNo) => (
        <div className="heatmap-row" key={laneNo}>
          <div className="lane-label">Lane {laneNo}</div>
          {PLANT_NUMBERS.map((plantNo) => {
            const record = displayRecords.get(`${laneNo}-${plantNo}`);

            if (!record) {
              return (
                <div className="heatmap-cell heatmap-empty" key={plantNo}>
                  -
                </div>
              );
            }

            const classification = record.classification;
            const scoreLabel = record.riskScore === undefined ? '--' : String(record.riskScore);

            return (
              <button
                className={`heatmap-cell heatmap-clickable heatmap-${classification ?? 'unknown'}`}
                key={plantNo}
                onClick={() => onCellClick(record)}
                type="button"
              >
                <strong>{classification ?? '-'}</strong>
                <span>{scoreLabel}</span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
