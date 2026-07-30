export const formatExerciseName = (name: string): string => {
  // Удаляем часть с количеством повторений: (10 повторений), (15 повторений) и т.д.
  return name.replace(/\(\d+\s+повторений\)/g, '').trim();
};