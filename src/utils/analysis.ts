import type { Classification, ScoutingRecord } from '../types';

export const classificationDefinitions: Record<
  Classification,
  { state: string; action: string; riskLabel: string }
> = {
  A: {
    state: '明確な被害あり',
    action: '重点対応・天敵散布検討',
    riskLabel: '高リスク',
  },
  B: {
    state: '肉眼では見えづらいが虫あり',
    action: '早期対応・周辺株確認',
    riskLabel: '中高リスク',
  },
  C: {
    state: '発生初期の可能性',
    action: '継続観察・再撮影',
    riskLabel: '注意',
  },
  Z: {
    state: '問題なし',
    action: '通常巡回',
    riskLabel: '問題なし',
  },
};

const hashText = (text: string) =>
  Array.from(text).reduce((total, char) => total + char.charCodeAt(0), 0);

const clampScore = (score: number) => Math.max(0, Math.min(100, Math.round(score)));

export const getRecommendedAction = (classification: Classification) =>
  classificationDefinitions[classification].action;

export const classifyScore = (score: number): Classification => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 35) return 'C';
  return 'Z';
};

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
