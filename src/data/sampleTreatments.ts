import type { TreatmentRecord } from '../types';

export const sampleTreatments: TreatmentRecord[] = [
  {
    id: 'treat-area-10-w3',
    fieldId: 'House-01',
    laneNo: '03',
    areaId: 'Area 10',
    treatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    weekOffset: -3,
    bottleCount: 2,
    note: '局所対応',
  },
  {
    id: 'treat-area-11-w3',
    fieldId: 'House-01',
    laneNo: '03',
    areaId: 'Area 11',
    treatedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
    weekOffset: -3,
    bottleCount: 1,
    note: '周辺確認後に対応',
  },
  {
    id: 'treat-area-15-w1',
    fieldId: 'House-01',
    laneNo: '03',
    areaId: 'Area 15',
    treatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    weekOffset: -1,
    bottleCount: 1,
    note: '予防的対応',
  },
];
