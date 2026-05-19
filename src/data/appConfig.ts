export const FIELD_ID = 'House-01';
export const FIELD_NAME = '第1ハウス';
export const TARGET_LANE_NO = '03';
export const TARGET_LANES = 'Lane 03';
export const CAPTURED_BY = 'User-01';
export const TARGET_PLANT_COUNT = 80;
export const SHOOTING_POSITION = '成長点の1段下';
export const STORAGE_LABEL = 'SDカードMock';
export const AREA_SIZE = 3;
export const AREA_COUNT = 27;

export const LANE_NUMBERS = ['03'];
export const PLANT_NUMBERS = Array.from({ length: TARGET_PLANT_COUNT }, (_, index) =>
  String(index + 1).padStart(3, '0'),
);

export const WEEK_OPTIONS = [
  { weekOffset: -5, weekLabel: '5週前' },
  { weekOffset: -4, weekLabel: '4週前' },
  { weekOffset: -3, weekLabel: '3週前' },
  { weekOffset: -2, weekLabel: '2週前' },
  { weekOffset: -1, weekLabel: '1週前' },
  { weekOffset: 0, weekLabel: '今週' },
];

export const IMAGE_PATHS = {
  original: '/assets/images/original-leaf.svg',
  blurred: '/assets/images/original-leaf-blur.svg',
  spectral: '/assets/images/spectral-leaf.svg',
};
