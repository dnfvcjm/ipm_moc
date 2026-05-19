import { sampleRecords } from '../data/sampleRecords';
import type { ScoutingRecord } from '../types';

const RECORDS_KEY = 'dn-ipm-spectral-scouting-records';
const MEMOS_KEY = 'dn-ipm-spectral-scouting-memos';
const ANALYSIS_KEY = 'dn-ipm-spectral-scouting-analysis-overrides';

type AnalysisOverride = Pick<
  ScoutingRecord,
  'analysisStatus' | 'classification' | 'riskScore' | 'recommendedAction'
>;

const canUseStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readJson = <T,>(key: string, fallback: T): T => {
  if (!canUseStorage()) return fallback;
  const rawValue = window.localStorage.getItem(key);
  if (!rawValue) return fallback;

  try {
    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
};

const writeJson = <T,>(key: string, value: T) => {
  if (!canUseStorage()) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const getStoredRecords = () => readJson<ScoutingRecord[]>(RECORDS_KEY, []);

export const saveStoredRecords = (records: ScoutingRecord[]) => {
  writeJson(RECORDS_KEY, records);
};

export const saveScoutingRecord = (record: ScoutingRecord) => {
  const records = getStoredRecords();
  const nextRecords = records.some((item) => item.id === record.id)
    ? records.map((item) => (item.id === record.id ? record : item))
    : [record, ...records];
  saveStoredRecords(nextRecords);
};

export const getMemos = () => readJson<Partial<Record<string, string>>>(MEMOS_KEY, {});

export const saveMemo = (recordId: string, memo: string) => {
  const memos = { ...getMemos(), [recordId]: memo };
  writeJson(MEMOS_KEY, memos);

  const records = getStoredRecords();
  if (records.some((record) => record.id === recordId)) {
    saveStoredRecords(records.map((record) => (record.id === recordId ? { ...record, memo } : record)));
  }
};

export const getAnalysisOverrides = () =>
  readJson<Partial<Record<string, AnalysisOverride>>>(ANALYSIS_KEY, {});

export const saveAnalysisResults = (records: ScoutingRecord[]) => {
  const overrides = { ...getAnalysisOverrides() };

  records.forEach((record) => {
    if (record.analysisStatus === '解析済み') {
      overrides[record.id] = {
        analysisStatus: record.analysisStatus,
        classification: record.classification,
        riskScore: record.riskScore,
        recommendedAction: record.recommendedAction,
      };
    }
  });

  writeJson(ANALYSIS_KEY, overrides);

  const storedRecords = getStoredRecords();
  if (storedRecords.length > 0) {
    const updatedStoredRecords = storedRecords.map((record) => {
      const analyzedRecord = records.find((item) => item.id === record.id);
      return analyzedRecord ?? record;
    });
    saveStoredRecords(updatedStoredRecords);
  }
};

export const getAllRecords = (): ScoutingRecord[] => {
  const memos = getMemos();
  const analysisOverrides = getAnalysisOverrides();
  const storedRecords = getStoredRecords();
  const sampleIds = new Set(sampleRecords.map((record) => record.id));
  const nonDuplicateStoredRecords = storedRecords.filter((record) => !sampleIds.has(record.id));

  return [...sampleRecords, ...nonDuplicateStoredRecords]
    .map((record) => ({
      ...record,
      ...analysisOverrides[record.id],
      memo: memos[record.id] ?? record.memo,
    }))
    .sort((a, b) => {
      const laneCompare = a.laneNo.localeCompare(b.laneNo);
      if (laneCompare !== 0) return laneCompare;
      return a.plantNo.localeCompare(b.plantNo);
    });
};
