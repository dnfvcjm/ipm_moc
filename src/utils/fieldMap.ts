import {
  AREA_COUNT,
  AREA_SIZE,
  TARGET_LANE_NO,
  TARGET_PLANT_COUNT,
} from '../data/appConfig';
import type { AreaRiskSummary } from '../types';
import { getAreaRiskGrade, getRecommendedBottleCount, getRecommendedPolicy } from './analysis';

export const FIELD_MAP_LANES = ['01', '02', '03', '04', '05', '06'];
export const FIELD_MAP_COLUMNS = 10;
export const FIELD_MAP_ROWS = 8;
export const FIELD_MAP_ROW_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

export const formatPlantLabel = (plantIndex: number) => String(plantIndex).padStart(3, '0');
export const formatAreaLabel = (areaIndex: number) => `Area ${String(areaIndex).padStart(2, '0')}`;

export const getAreaIndexByPlantIndex = (plantIndex: number) =>
  Math.ceil(Math.min(TARGET_PLANT_COUNT, Math.max(1, plantIndex)) / AREA_SIZE);

export const getPlantCellInfo = (plantIndex: number) => {
  const safePlantIndex = Math.min(TARGET_PLANT_COUNT, Math.max(1, plantIndex));
  const areaIndex = getAreaIndexByPlantIndex(safePlantIndex);
  const rowIndex = Math.floor((safePlantIndex - 1) / FIELD_MAP_COLUMNS);
  const columnIndex = (safePlantIndex - 1) % FIELD_MAP_COLUMNS;

  return {
    areaId: formatAreaLabel(areaIndex),
    areaIndex,
    columnIndex,
    columnLabel: String(columnIndex + 1),
    plantIndex: safePlantIndex,
    plantLabel: formatPlantLabel(safePlantIndex),
    rowIndex,
    rowLabel: FIELD_MAP_ROW_LABELS[rowIndex],
  };
};

export const getAreaPlantRange = (areaIndex: number) => {
  const areaStartPlant = (areaIndex - 1) * AREA_SIZE + 1;
  const areaEndPlant = Math.min(areaIndex * AREA_SIZE, TARGET_PLANT_COUNT);

  return {
    areaEndPlant,
    areaStartPlant,
  };
};

const clampProblemCount = (value: number, validPhotoCount: number) =>
  Math.max(0, Math.min(validPhotoCount, Math.round(value)));

export const deriveLaneAreaSummary = (source: AreaRiskSummary, laneNo: string): AreaRiskSummary => {
  if (laneNo === TARGET_LANE_NO) {
    return source;
  }

  const areaIndex = Number(source.areaId.replace('Area ', ''));
  const laneNumber = Number(laneNo);
  const selectedLaneNumber = Number(TARGET_LANE_NO);
  const laneDistance = Math.abs(laneNumber - selectedLaneNumber);
  const seed = (areaIndex * 17 + laneNumber * 23 + (source.weekOffset + 6) * 11) % 7;

  let problemPhotoCount = source.problemPhotoCount;

  if (source.problemPhotoCount > 0) {
    problemPhotoCount = source.problemPhotoCount - laneDistance;

    if (areaIndex >= 9 && areaIndex <= 12 && laneDistance === 1) {
      problemPhotoCount = Math.max(problemPhotoCount, source.problemPhotoCount - 1);
    }

    if (areaIndex >= 14 && areaIndex <= 16 && laneNumber >= 3 && laneNumber <= 5) {
      problemPhotoCount = Math.max(problemPhotoCount, laneNumber === 4 ? 2 : 1);
    }

    if (seed === 0) {
      problemPhotoCount += 1;
    }
  } else if ([6, 18, 22].includes(areaIndex) && seed <= 1) {
    problemPhotoCount = 1;
  }

  const validPhotoCount = source.validPhotoCount;
  const safeProblemCount = clampProblemCount(problemPhotoCount, validPhotoCount);
  const problemRatio = validPhotoCount === 0 ? 0 : safeProblemCount / validPhotoCount;
  const areaRiskGrade = getAreaRiskGrade(problemRatio);

  return {
    ...source,
    id: `${source.id}-lane-${laneNo}`,
    laneNo,
    problemPhotoCount: safeProblemCount,
    problemRatio,
    areaRiskGrade,
    areaRiskScore: Math.round(problemRatio * 100),
    recommendedBottleCount: getRecommendedBottleCount(areaRiskGrade),
    recommendedPolicy: getRecommendedPolicy(areaRiskGrade),
  };
};

export const ensureAreaSummaries = (summaries: AreaRiskSummary[]): AreaRiskSummary[] => {
  const byArea = new Map(summaries.map((summary) => [summary.areaId, summary]));
  const fallbackBase = summaries[0];

  return Array.from({ length: AREA_COUNT }, (_, index) => {
    const areaIndex = index + 1;
    const areaId = formatAreaLabel(areaIndex);
    const existing = byArea.get(areaId);
    if (existing) return existing;

    const { areaStartPlant, areaEndPlant } = getAreaPlantRange(areaIndex);
    const validPhotoCount = areaEndPlant - areaStartPlant + 1;

    return {
      areaEndPlant,
      areaId,
      areaRiskGrade: 'Z',
      areaRiskScore: 0,
      areaStartPlant,
      batchId: fallbackBase?.batchId ?? 'field-map-mock',
      fieldId: fallbackBase?.fieldId ?? 'House-01',
      id: `field-map-fallback-${areaId}`,
      laneNo: TARGET_LANE_NO,
      problemPhotoCount: 0,
      problemRatio: 0,
      recommendedBottleCount: 0,
      recommendedPolicy: getRecommendedPolicy('Z'),
      validPhotoCount,
      weekLabel: fallbackBase?.weekLabel ?? '',
      weekOffset: fallbackBase?.weekOffset ?? 0,
    };
  });
};
