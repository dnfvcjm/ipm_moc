export type Classification = 'A' | 'B' | 'C' | 'Z';
export type AnalysisStatus = '未解析' | '解析中' | '解析済み';
export type PhotoQuality = 'clear' | 'blurred';

export type FieldAssignment = {
  id: string;
  fieldId: string;
  fieldName: string;
  laneNo: string;
  targetPlantCount: number;
  shootingPosition: string;
  assignedDate: string;
};

export type CaptureBatch = {
  id: string;
  fieldId: string;
  fieldName: string;
  laneNo: string;
  capturedBy: string;
  startedAt: string;
  completedAt?: string;
  targetPlantCount: number;
  validPhotoCount: number;
  blurredRetakeCount: number;
  storageLabel: string;
  analysisStatus: AnalysisStatus;
};

export type PhotoRecord = {
  id: string;
  batchId: string;
  fieldId: string;
  laneNo: string;
  plantIndex: number;
  areaId: string;
  areaStartPlant: number;
  areaEndPlant: number;
  capturedAt: string;
  imageId: string;
  photoQuality: PhotoQuality;
  isValidForAnalysis: boolean;
  sourceImagePath?: string;
  processedImagePath?: string;
  riskScore?: number;
  classification?: Classification;
  isProblem?: boolean;
  processedImageId?: string;
};

export type AreaRiskSummary = {
  id: string;
  batchId: string;
  fieldId: string;
  laneNo: string;
  areaId: string;
  areaStartPlant: number;
  areaEndPlant: number;
  weekOffset: number;
  weekLabel: string;
  validPhotoCount: number;
  problemPhotoCount: number;
  problemRatio: number;
  areaRiskScore: number;
  areaRiskGrade: Classification;
  recommendedBottleCount: number;
  recommendedPolicy: string;
};

export type TreatmentRecord = {
  id: string;
  fieldId: string;
  laneNo: string;
  areaId: string;
  treatedAt: string;
  weekOffset: number;
  bottleCount: number;
  note: string;
};

export type CaptureSessionState = {
  batchId: string;
  fieldId: string;
  fieldName: string;
  laneNo: string;
  capturedBy: string;
  startedAt: string;
  currentPlantIndex: number;
  targetPlantCount: number;
  blurredPlantIndexes: number[];
  retakeCountByPlant: Record<string, number>;
  totalBlurredRetakeCount: number;
};

export type PendingCapture = {
  batchId: string;
  plantIndex: number;
  capturedAt: string;
  imageId: string;
  photoQuality: PhotoQuality;
};

export type ScoutingRecord = {
  id: string;
  fieldId: string;
  laneNo: string;
  plantNo: string;
  capturedAt: string;
  capturedBy: string;
  imageId: string;
  analysisStatus: AnalysisStatus;
  classification?: Classification;
  riskScore?: number;
  recommendedAction?: string;
  memo?: string;
};

export type CaptureDraft = {
  fieldId: string;
  laneNo: string;
  plantNo: string;
  capturedAt: string;
  capturedBy: string;
  imageId: string;
};
