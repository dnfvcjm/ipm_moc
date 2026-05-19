import {
  AREA_COUNT,
  AREA_SIZE,
  FIELD_ID,
  IMAGE_PATHS,
  TARGET_LANE_NO,
  TARGET_PLANT_COUNT,
  WEEK_OPTIONS,
} from '../data/appConfig';
import type { AreaRiskSummary, Classification, PhotoRecord, ScoutingRecord } from '../types';

export const classificationDefinitions: Record<
  Classification,
  { state: string; action: string; riskLabel: string }
> = {
  A: {
    state: '明確な被害あり',
    action: '重点対応。局所的な防除を推奨',
    riskLabel: '高リスク',
  },
  B: {
    state: '肉眼では見えづらいが虫あり',
    action: '周辺エリアを含めて確認。必要に応じて防除',
    riskLabel: '中高リスク',
  },
  C: {
    state: '発生初期の可能性',
    action: '継続観察。次回も同エリアを確認',
    riskLabel: '注意',
  },
  Z: {
    state: '問題なし',
    action: '通常管理',
    riskLabel: '問題なし',
  },
};

const hashText = (text: string) =>
  Array.from(text).reduce((total, char) => total + char.charCodeAt(0), 0);

const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

const formatAreaId = (areaIndex: number) => `Area ${String(areaIndex).padStart(2, '0')}`;

export const getRecommendedAction = (classification: Classification) =>
  classificationDefinitions[classification].action;

export const classifyScore = (score: number): Classification => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 35) return 'C';
  return 'Z';
};

export const getAreaInfoByPlantIndex = (plantIndex: number) => {
  const safePlantIndex = Math.max(1, Math.min(TARGET_PLANT_COUNT, plantIndex));
  const areaIndex = Math.ceil(safePlantIndex / AREA_SIZE);
  const areaStartPlant = (areaIndex - 1) * AREA_SIZE + 1;
  const areaEndPlant = Math.min(areaIndex * AREA_SIZE, TARGET_PLANT_COUNT);

  return {
    areaId: formatAreaId(areaIndex),
    areaStartPlant,
    areaEndPlant,
  };
};

export const getRecommendedBottleCount = (classification: Classification) => {
  if (classification === 'A') return 3;
  if (classification === 'B') return 2;
  if (classification === 'C') return 1;
  return 0;
};

export const getRecommendedPolicy = (classification: Classification) =>
  classificationDefinitions[classification].action;

export const getAreaRiskGrade = (problemRatio: number): Classification => {
  if (problemRatio >= 0.67) return 'A';
  if (problemRatio >= 0.34) return 'B';
  if (problemRatio > 0) return 'C';
  return 'Z';
};

export const getBlurredPlantIndexes = () => [7, 42];

export const shouldShowBlurredImage = (
  plantIndex: number,
  retakeCountByPlant: Record<string, number>,
  blurredPlantIndexes = getBlurredPlantIndexes(),
) => blurredPlantIndexes.includes(plantIndex) && (retakeCountByPlant[String(plantIndex)] ?? 0) === 0;

const getMockPhotoScore = (photo: PhotoRecord) => {
  const areaNumber = Number(photo.areaId.replace('Area ', ''));
  const seed = hashText(`${photo.batchId}-${photo.plantIndex}-${photo.imageId}`);

  if (areaNumber >= 9 && areaNumber <= 12) {
    return clampScore(58 + (seed % 40));
  }

  if (areaNumber >= 14 && areaNumber <= 16) {
    return clampScore(36 + (seed % 36));
  }

  if (areaNumber === 8 || areaNumber === 13 || areaNumber === 17) {
    return clampScore(22 + (seed % 35));
  }

  return clampScore(5 + (seed % 30));
};

export const analyzePhotos = (photoRecords: PhotoRecord[]) =>
  photoRecords.map((photo) => {
    if (!photo.isValidForAnalysis) return photo;

    const riskScore = photo.riskScore ?? getMockPhotoScore(photo);
    const classification = photo.classification ?? classifyScore(riskScore);

    return {
      ...photo,
      riskScore,
      classification,
      isProblem: classification !== 'Z',
      processedImagePath: IMAGE_PATHS.spectral,
      processedImageId: `SPC-${photo.imageId}`,
    };
  });

export const aggregateAreaRisk = (photoRecords: PhotoRecord[]): AreaRiskSummary[] => {
  const validPhotos = photoRecords.filter((photo) => photo.isValidForAnalysis);

  return Array.from({ length: AREA_COUNT }, (_, index) => {
    const areaIndex = index + 1;
    const areaId = formatAreaId(areaIndex);
    const areaStartPlant = index * AREA_SIZE + 1;
    const areaEndPlant = Math.min(areaIndex * AREA_SIZE, TARGET_PLANT_COUNT);
    const areaPhotos = validPhotos.filter((photo) => photo.areaId === areaId);
    const problemPhotoCount = areaPhotos.filter((photo) => photo.isProblem).length;
    const validPhotoCount = areaPhotos.length;
    const problemRatio = validPhotoCount === 0 ? 0 : problemPhotoCount / validPhotoCount;
    const areaRiskGrade = getAreaRiskGrade(problemRatio);
    const averageScore =
      validPhotoCount === 0
        ? 0
        : areaPhotos.reduce((total, photo) => total + (photo.riskScore ?? 0), 0) / validPhotoCount;

    return {
      id: `current-${areaId}`,
      batchId: areaPhotos[0]?.batchId ?? 'current-batch',
      fieldId: areaPhotos[0]?.fieldId ?? FIELD_ID,
      laneNo: areaPhotos[0]?.laneNo ?? TARGET_LANE_NO,
      areaId,
      areaStartPlant,
      areaEndPlant,
      weekOffset: 0,
      weekLabel: '今週',
      validPhotoCount,
      problemPhotoCount,
      problemRatio,
      areaRiskScore: clampScore(averageScore || problemRatio * 100),
      areaRiskGrade,
      recommendedBottleCount: getRecommendedBottleCount(areaRiskGrade),
      recommendedPolicy: getRecommendedPolicy(areaRiskGrade),
    };
  });
};

const getWeeklyProblemCount = (areaIndex: number, weekOffset: number) => {
  if (areaIndex === 10) {
    const map: Record<number, number> = { [-5]: 1, [-4]: 2, [-3]: 3, [-2]: 2, [-1]: 1, 0: 0 };
    return map[weekOffset] ?? 0;
  }

  if (areaIndex === 11) {
    const map: Record<number, number> = { [-5]: 1, [-4]: 1, [-3]: 2, [-2]: 1, [-1]: 1, 0: 0 };
    return map[weekOffset] ?? 0;
  }

  if (areaIndex === 9 || areaIndex === 12) {
    const map: Record<number, number> = { [-5]: 1, [-4]: 2, [-3]: 2, [-2]: 1, [-1]: 1, 0: 1 };
    return map[weekOffset] ?? 0;
  }

  if (areaIndex >= 14 && areaIndex <= 16) {
    const spread = Math.max(0, weekOffset + 5);
    return Math.min(3, areaIndex === 15 ? Math.ceil(spread / 2) : Math.floor(spread / 2));
  }

  if ([6, 18, 22].includes(areaIndex)) {
    return weekOffset >= -1 ? 1 : 0;
  }

  return 0;
};

export const generateWeeklyAreaRiskMock = (): AreaRiskSummary[] =>
  WEEK_OPTIONS.flatMap(({ weekOffset, weekLabel }) =>
    Array.from({ length: AREA_COUNT }, (_, index) => {
      const areaIndex = index + 1;
      const areaId = formatAreaId(areaIndex);
      const areaStartPlant = index * AREA_SIZE + 1;
      const areaEndPlant = Math.min(areaIndex * AREA_SIZE, TARGET_PLANT_COUNT);
      const validPhotoCount = areaEndPlant - areaStartPlant + 1;
      const problemPhotoCount = Math.min(validPhotoCount, getWeeklyProblemCount(areaIndex, weekOffset));
      const problemRatio = validPhotoCount === 0 ? 0 : problemPhotoCount / validPhotoCount;
      const areaRiskGrade = getAreaRiskGrade(problemRatio);

      return {
        id: `weekly-${weekOffset}-${areaId}`,
        batchId: 'weekly-risk-mock',
        fieldId: FIELD_ID,
        laneNo: TARGET_LANE_NO,
        areaId,
        areaStartPlant,
        areaEndPlant,
        weekOffset,
        weekLabel,
        validPhotoCount,
        problemPhotoCount,
        problemRatio,
        areaRiskScore: clampScore(problemRatio * 100),
        areaRiskGrade,
        recommendedBottleCount: getRecommendedBottleCount(areaRiskGrade),
        recommendedPolicy: getRecommendedPolicy(areaRiskGrade),
      };
    }),
  );

export const generateMockRiskScore = (record: ScoutingRecord) => {
  const plantNumber = Number(record.plantNo);
  const seed = hashText(`${record.id}-${record.laneNo}-${record.plantNo}`);

  if (record.laneNo === '03' && plantNumber >= 10 && plantNumber <= 15) {
    return clampScore(66 + (seed % 33));
  }

  if (record.laneNo === '03' && plantNumber >= 7 && plantNumber <= 17) {
    return clampScore(45 + (seed % 28));
  }

  return clampScore(12 + (seed % 49));
};

export const analyzeRecord = (record: ScoutingRecord): ScoutingRecord => {
  const riskScore = record.riskScore ?? generateMockRiskScore(record);
  const classification = record.classification ?? classifyScore(riskScore);

  return {
    ...record,
    analysisStatus: '解析済み',
    riskScore,
    classification,
    recommendedAction: getRecommendedAction(classification),
  };
};

export const analyzeRecords = (records: ScoutingRecord[]) =>
  records.map((record) => (record.analysisStatus === '未解析' ? analyzeRecord(record) : record));
