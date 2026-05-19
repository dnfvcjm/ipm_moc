import {
  CAPTURED_BY,
  FIELD_ID,
  FIELD_NAME,
  IMAGE_PATHS,
  STORAGE_LABEL,
  TARGET_LANE_NO,
  TARGET_PLANT_COUNT,
} from '../data/appConfig';
import { sampleRecords } from '../data/sampleRecords';
import type {
  AreaRiskSummary,
  CaptureBatch,
  CaptureSessionState,
  PendingCapture,
  PhotoRecord,
  ScoutingRecord,
} from '../types';
import { aggregateAreaRisk, getAreaInfoByPlantIndex, getBlurredPlantIndexes } from './analysis';

const RECORDS_KEY = 'dn-ipm-spectral-scouting-records';
const MEMOS_KEY = 'dn-ipm-spectral-scouting-memos';
const ANALYSIS_KEY = 'dn-ipm-spectral-scouting-analysis-overrides';
const BATCHES_KEY = 'dn-ipm-lane-capture-batches';
const PHOTOS_KEY = 'dn-ipm-lane-capture-photos';
const SESSION_KEY = 'dn-ipm-current-capture-session';
const PENDING_CAPTURE_KEY = 'dn-ipm-pending-capture';
const AREA_RISK_KEY = 'dn-ipm-current-area-risk';

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

const removeItem = (key: string) => {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(key);
};

const formatTimestamp = () => {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}`;
  const time = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(
    2,
    '0',
  )}${String(now.getSeconds()).padStart(2, '0')}`;
  return `${date}-${time}`;
};

export const createBatchId = () => `BATCH-${formatTimestamp()}-LANE03`;

export const createImageId = (plantIndex: number) =>
  `IMG-${new Date().toISOString().slice(0, 10).replaceAll('-', '')}-${String(plantIndex).padStart(3, '0')}-${Date.now()
    .toString()
    .slice(-5)}`;

export const createCaptureSession = (): CaptureSessionState => ({
  batchId: createBatchId(),
  fieldId: FIELD_ID,
  fieldName: FIELD_NAME,
  laneNo: TARGET_LANE_NO,
  capturedBy: CAPTURED_BY,
  startedAt: new Date().toISOString(),
  currentPlantIndex: 1,
  targetPlantCount: TARGET_PLANT_COUNT,
  blurredPlantIndexes: getBlurredPlantIndexes(),
  retakeCountByPlant: {},
  totalBlurredRetakeCount: 0,
});

export const getCaptureSession = () =>
  readJson<CaptureSessionState | null>(SESSION_KEY, null);

export const saveCaptureSession = (session: CaptureSessionState) => {
  writeJson(SESSION_KEY, session);
};

export const startNewCaptureSession = () => {
  const session = createCaptureSession();
  saveCaptureSession(session);
  savePendingCapture(null);
  return session;
};

export const clearCaptureSession = () => {
  removeItem(SESSION_KEY);
  removeItem(PENDING_CAPTURE_KEY);
};

export const getPendingCapture = () =>
  readJson<PendingCapture | null>(PENDING_CAPTURE_KEY, null);

export const savePendingCapture = (pending: PendingCapture | null) => {
  if (!pending) {
    removeItem(PENDING_CAPTURE_KEY);
    return;
  }
  writeJson(PENDING_CAPTURE_KEY, pending);
};

export const getCaptureBatches = () => readJson<CaptureBatch[]>(BATCHES_KEY, []);

export const saveCaptureBatches = (batches: CaptureBatch[]) => {
  writeJson(BATCHES_KEY, batches);
};

export const upsertCaptureBatch = (batch: CaptureBatch) => {
  const batches = getCaptureBatches();
  const nextBatches = batches.some((item) => item.id === batch.id)
    ? batches.map((item) => (item.id === batch.id ? batch : item))
    : [batch, ...batches];
  saveCaptureBatches(nextBatches);
};

export const getPhotoRecords = () => readJson<PhotoRecord[]>(PHOTOS_KEY, []);

export const savePhotoRecords = (photos: PhotoRecord[]) => {
  writeJson(PHOTOS_KEY, photos);
};

export const getValidPhotosByBatch = (batchId: string) =>
  getPhotoRecords().filter((photo) => photo.batchId === batchId && photo.isValidForAnalysis);

export const saveValidPhoto = (session: CaptureSessionState, pending: PendingCapture) => {
  const areaInfo = getAreaInfoByPlantIndex(pending.plantIndex);
  const photo: PhotoRecord = {
    id: `${pending.batchId}-${String(pending.plantIndex).padStart(3, '0')}-${pending.imageId}`,
    batchId: pending.batchId,
    fieldId: session.fieldId,
    laneNo: session.laneNo,
    plantIndex: pending.plantIndex,
    ...areaInfo,
    capturedAt: pending.capturedAt,
    imageId: pending.imageId,
    photoQuality: 'clear',
    isValidForAnalysis: true,
    sourceImagePath: IMAGE_PATHS.original,
  };

  const photos = getPhotoRecords().filter(
    (item) => !(item.batchId === photo.batchId && item.plantIndex === photo.plantIndex),
  );
  savePhotoRecords([...photos, photo]);
  savePendingCapture(null);
  return photo;
};

export const completeCaptureBatch = (session: CaptureSessionState) => {
  const validPhotoCount = getValidPhotosByBatch(session.batchId).length;
  const batch: CaptureBatch = {
    id: session.batchId,
    fieldId: session.fieldId,
    fieldName: session.fieldName,
    laneNo: session.laneNo,
    capturedBy: session.capturedBy,
    startedAt: session.startedAt,
    completedAt: new Date().toISOString(),
    targetPlantCount: session.targetPlantCount,
    validPhotoCount,
    blurredRetakeCount: session.totalBlurredRetakeCount,
    storageLabel: STORAGE_LABEL,
    analysisStatus: '未解析',
  };
  upsertCaptureBatch(batch);
  clearCaptureSession();
  return batch;
};

export const incrementRetakeForPlant = (plantIndex: number) => {
  const session = getCaptureSession();
  if (!session) return null;

  const key = String(plantIndex);
  const nextSession: CaptureSessionState = {
    ...session,
    retakeCountByPlant: {
      ...session.retakeCountByPlant,
      [key]: (session.retakeCountByPlant[key] ?? 0) + 1,
    },
    totalBlurredRetakeCount: session.totalBlurredRetakeCount + 1,
  };
  saveCaptureSession(nextSession);
  savePendingCapture(null);
  return nextSession;
};

export const saveAnalyzedBatch = (
  batchId: string,
  analyzedPhotos: PhotoRecord[],
  areaRiskSummaries: AreaRiskSummary[],
) => {
  const allPhotos = getPhotoRecords().filter((photo) => photo.batchId !== batchId);
  savePhotoRecords([...allPhotos, ...analyzedPhotos]);

  saveCaptureBatches(
    getCaptureBatches().map((batch) =>
      batch.id === batchId ? { ...batch, analysisStatus: '解析済み' } : batch,
    ),
  );

  writeJson(AREA_RISK_KEY, areaRiskSummaries);
};

export const getCurrentAreaRiskSummaries = () =>
  readJson<AreaRiskSummary[]>(AREA_RISK_KEY, []);

export const createDemoBatchIfNeeded = () => {
  const batches = getCaptureBatches();
  if (batches.length > 0) return batches[0];

  const batchId = createBatchId();
  const startedAt = new Date(Date.now() - 90 * 60 * 1000).toISOString();
  const completedAt = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  const batch: CaptureBatch = {
    id: batchId,
    fieldId: FIELD_ID,
    fieldName: FIELD_NAME,
    laneNo: TARGET_LANE_NO,
    capturedBy: CAPTURED_BY,
    startedAt,
    completedAt,
    targetPlantCount: TARGET_PLANT_COUNT,
    validPhotoCount: TARGET_PLANT_COUNT,
    blurredRetakeCount: 2,
    storageLabel: STORAGE_LABEL,
    analysisStatus: '未解析',
  };

  const photos: PhotoRecord[] = Array.from({ length: TARGET_PLANT_COUNT }, (_, index) => {
    const plantIndex = index + 1;
    const areaInfo = getAreaInfoByPlantIndex(plantIndex);
    return {
      id: `${batchId}-${String(plantIndex).padStart(3, '0')}`,
      batchId,
      fieldId: FIELD_ID,
      laneNo: TARGET_LANE_NO,
      plantIndex,
      ...areaInfo,
      capturedAt: new Date(Date.now() - (TARGET_PLANT_COUNT - plantIndex) * 40 * 1000).toISOString(),
      imageId: `IMG-DEMO-${String(plantIndex).padStart(3, '0')}`,
      photoQuality: 'clear',
      isValidForAnalysis: true,
      sourceImagePath: IMAGE_PATHS.original,
    };
  });

  saveCaptureBatches([batch]);
  savePhotoRecords(photos);
  writeJson(AREA_RISK_KEY, aggregateAreaRisk(photos));
  return batch;
};

export const exportMockJson = () => ({
  batches: getCaptureBatches(),
  photos: getPhotoRecords(),
  areaRiskSummaries: getCurrentAreaRiskSummaries(),
});

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
