import { FIELD_ID, FIELD_NAME, SHOOTING_POSITION, TARGET_LANE_NO, TARGET_PLANT_COUNT } from './appConfig';
import type { FieldAssignment } from '../types';

export const sampleAssignment: FieldAssignment = {
  id: 'assignment-house-01-lane-03',
  fieldId: FIELD_ID,
  fieldName: FIELD_NAME,
  laneNo: TARGET_LANE_NO,
  targetPlantCount: TARGET_PLANT_COUNT,
  shootingPosition: SHOOTING_POSITION,
  assignedDate: new Date().toISOString(),
};
