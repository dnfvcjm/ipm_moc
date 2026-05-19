export const formatDate = (date = new Date()) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

export const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(value));

export const normalizeLaneNo = (value: string) => value.trim().padStart(2, '0');

export const normalizePlantNo = (value: string) => value.trim().padStart(3, '0');

export const nextPlantNo = (value: string) =>
  String(Number(value) + 1).padStart(3, '0');

export const createImageId = (date: Date) => {
  const yyyymmdd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate(),
  ).padStart(2, '0')}`;
  const suffix = `${String(date.getHours()).padStart(2, '0')}${String(date.getMinutes()).padStart(
    2,
    '0',
  )}${String(date.getSeconds()).padStart(2, '0')}`;
  return `IMG-${yyyymmdd}-${suffix}`;
};
