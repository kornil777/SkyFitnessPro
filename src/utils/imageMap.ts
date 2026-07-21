// src/utils/imageMap.ts

export const courseImageMap: Record<string, string> = {
  'Йога': 'ioga.svg',
  'Стретчинг': 'strech.svg',
  'Фитнес': 'fit.svg',
  'Степ-аэробика': 'step.svg',
  'Бодифлекс': 'body.svg',
};

export const getCourseImage = (nameRU: string): string => {
  return `/images/${courseImageMap[nameRU] || 'card1.svg'}`;
};