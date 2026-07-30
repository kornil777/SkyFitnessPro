const base = import.meta.env.BASE_URL || '/';

export const getImagePath = (path: string): string => {
  // Если путь уже начинается с base, не добавляем повторно
  if (path.startsWith(base)) return path;
  // Убираем начальный слеш, если он есть, чтобы не было двойного слеша
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${base}${cleanPath}`;
};