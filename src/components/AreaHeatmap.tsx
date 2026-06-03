import { Fragment, useMemo, useState } from 'react';
import { TARGET_LANE_NO } from '../data/appConfig';
import { useI18n } from '../i18n/LanguageContext';
import type { AreaRiskSummary } from '../types';
import {
  deriveLaneAreaSummary,
  ensureAreaSummaries,
  FIELD_MAP_LANES,
  formatPlantLabel,
} from '../utils/fieldMap';
import RiskBadge from './RiskBadge';

type AreaHeatmapProps = {
  summaries: AreaRiskSummary[];
  onSelectArea: (areaId: string, weekOffset?: number) => void;
  compact?: boolean;
};

type LaneMap = {
  laneNo: string;
  summaries: AreaRiskSummary[];
  summaryByArea: Map<string, AreaRiskSummary>;
};

const getPreferredActiveSummary = (laneMaps: LaneMap[]) => {
  const selectedLane = laneMaps.find((lane) => lane.laneNo === TARGET_LANE_NO) ?? laneMaps[0];
  return (
    selectedLane?.summaries.find((summary) => summary.areaRiskGrade === 'A')
    ?? selectedLane?.summaries.find((summary) => summary.areaRiskGrade === 'B')
    ?? selectedLane?.summaries[0]
    ?? null
  );
};

export default function AreaHeatmap({ summaries, onSelectArea, compact = false }: AreaHeatmapProps) {
  const { riskLabel, t } = useI18n();
  const [activeSummary, setActiveSummary] = useState<AreaRiskSummary | null>(null);

  const areaRows = useMemo(() => ensureAreaSummaries(summaries), [summaries]);

  const laneMaps = useMemo<LaneMap[]>(() => (
    FIELD_MAP_LANES.map((laneNo) => {
      const laneSummaries = areaRows.map((summary) => deriveLaneAreaSummary(summary, laneNo));

      return {
        laneNo,
        summaries: laneSummaries,
        summaryByArea: new Map(laneSummaries.map((summary) => [summary.areaId, summary])),
      };
    })
  ), [areaRows]);

  const selectedSummary = activeSummary ?? getPreferredActiveSummary(laneMaps);
  const activeKey = selectedSummary ? `${selectedSummary.laneNo}-${selectedSummary.areaId}` : '';
  const laneColumns = laneMaps
    .map((_, index) => (index < laneMaps.length - 1 ? 'minmax(88px, 1fr) minmax(20px, 30px)' : 'minmax(88px, 1fr)'))
    .join(' ');
  const gridTemplateColumns = `minmax(128px, 172px) ${laneColumns}`;

  return (
    <div className={`field-map-heatmap integrated-field-view ${compact ? 'compact' : ''}`}>
      <div className="field-map-header">
        <div>
          <p className="eyebrow">{t.heatmap.fieldMapEyebrow}</p>
          <h2>{t.heatmap.fieldMapTitle}</h2>
          <p>{t.heatmap.fieldMapLead}</p>
        </div>
        {selectedSummary ? (
          <aside className="field-map-detail" aria-live="polite">
            <span>{t.heatmap.selectedArea}</span>
            <strong>Lane {selectedSummary.laneNo} / {selectedSummary.areaId}</strong>
            <dl>
              <div>
                <dt>{t.heatmap.plantRange}</dt>
                <dd>
                  {formatPlantLabel(selectedSummary.areaStartPlant)}-
                  {formatPlantLabel(selectedSummary.areaEndPlant)}
                </dd>
              </div>
              <div>
                <dt>{t.heatmap.riskRank}</dt>
                <dd>
                  <RiskBadge
                    grade={selectedSummary.areaRiskGrade}
                    label={`${selectedSummary.areaRiskGrade}: ${riskLabel(selectedSummary.areaRiskGrade)}`}
                  />
                </dd>
              </div>
              <div>
                <dt>{t.heatmap.problemPhotos}</dt>
                <dd>{selectedSummary.problemPhotoCount}/{selectedSummary.validPhotoCount}</dd>
              </div>
              <div>
                <dt>{t.heatmap.recommendedBottles}</dt>
                <dd>{selectedSummary.recommendedBottleCount} {t.common.bottles}</dd>
              </div>
            </dl>
          </aside>
        ) : null}
      </div>

      <div className="integrated-map-panel">
        <div className="integrated-map-scroll">
          <div
            className="integrated-map-grid"
            style={{ gridTemplateColumns }}
          >
            <div className="integrated-map-corner">{t.heatmap.areaAxis}</div>
            {laneMaps.map((lane, laneIndex) => (
              <Fragment key={lane.laneNo}>
                <div
                  className={`integrated-lane-header ${lane.laneNo === TARGET_LANE_NO ? 'current-lane' : ''}`}
                >
                  <strong>Lane {lane.laneNo}</strong>
                  {lane.laneNo === TARGET_LANE_NO ? <span>{t.heatmap.currentLane}</span> : null}
                </div>
                {laneIndex < laneMaps.length - 1 ? (
                  <div className="integrated-aisle-header" aria-hidden="true">
                    <span>{t.heatmap.aisle}</span>
                  </div>
                ) : null}
              </Fragment>
            ))}

            {areaRows.map((area, areaIndex) => (
              <Fragment key={area.areaId}>
                <div className="integrated-area-label" key={`${area.areaId}-label`}>
                  <strong>{area.areaId}</strong>
                  <span>
                    Plant {formatPlantLabel(area.areaStartPlant)}-
                    {formatPlantLabel(area.areaEndPlant)}
                  </span>
                </div>
                {laneMaps.map((lane, laneIndex) => {
                  const summary = lane.summaryByArea.get(area.areaId);
                  if (!summary) return null;
                  const areaKey = `${summary.laneNo}-${summary.areaId}`;

                  return (
                    <Fragment key={`${summary.laneNo}-${summary.areaId}`}>
                      <button
                        aria-label={`Lane ${summary.laneNo} ${summary.areaId}`}
                        className={`integrated-map-cell plant-risk-${summary.areaRiskGrade} ${summary.laneNo === TARGET_LANE_NO ? 'target-lane-cell' : ''} ${activeKey === areaKey ? 'area-active' : ''}`}
                        onClick={() => onSelectArea(summary.areaId, summary.weekOffset)}
                        onFocus={() => setActiveSummary(summary)}
                        onMouseEnter={() => setActiveSummary(summary)}
                        title={`Lane ${summary.laneNo} / ${summary.areaId} / Plant ${formatPlantLabel(summary.areaStartPlant)}-${formatPlantLabel(summary.areaEndPlant)} / ${summary.areaRiskGrade}`}
                        type="button"
                      >
                        <strong>{summary.areaRiskGrade}</strong>
                        <span>{summary.problemPhotoCount}/{summary.validPhotoCount}</span>
                      </button>
                      {laneIndex < laneMaps.length - 1 ? (
                        <div className="integrated-aisle-cell" aria-hidden="true" />
                      ) : null}
                    </Fragment>
                  );
                })}
                {areaIndex === 12 ? (
                  <div className="integrated-cross-aisle" aria-hidden="true">
                    <span>{t.heatmap.centralAisle}</span>
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
