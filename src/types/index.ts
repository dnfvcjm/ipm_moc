export type Classification = 'A' | 'B' | 'C' | 'Z';
export type AnalysisStatus = '未解析' | '解析中' | '解析済み';

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
