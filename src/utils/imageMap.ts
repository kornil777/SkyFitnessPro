// src/utils/imageMap.ts

// Маппинг названий курсов к файлам картинок
export const courseImageMap: Record<string, string> = {
  'Йога': 'ioga.svg',
  'Стретчинг': 'strech.svg',
  'Фитнес': 'fit.svg',
  'Степ-аэробика': 'step.svg',
  'Бодифлекс': 'body.svg',
};

// Цвета фона для баннеров курсов
export const courseBannerColor: Record<string, string> = {
  'Йога': '#FFC700',
  'Стретчинг': '#2491D2',
  'Фитнес': '#F7A012',
  'Степ-аэробика': '#FF7E65',
  'Бодифлекс': '#7D458C',
};

// Изображения спортсменов для баннеров
export const courseBannerSport: Record<string, string> = {
  'Йога': 'yoga-sport.png',
  'Стретчинг': 'stretching-sport.png',
  'Фитнес': 'fitness-sport.png',
  'Степ-аэробика': 'step-sport.png',
  'Бодифлекс': 'bodyflex-sport.png',
};


export const getCourseImage = (nameRU: string): string => {
  return `images/${courseImageMap[nameRU] || 'card1.svg'}`;
};


export const getBannerColor = (nameRU: string): string => {
  return courseBannerColor[nameRU] || '#333333'; // цвет по умолчанию
};


export const getBannerSport = (nameRU: string): string => {
  return `images/banners/${courseBannerSport[nameRU] || 'default-sport.png'}`;
};