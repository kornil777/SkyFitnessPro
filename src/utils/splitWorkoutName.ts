export const splitWorkoutName = (name: string) => {
  const parts = name.split(' / ');
  if (parts.length >= 2) {
    const title = parts[0].trim();
    let subtitle = '';
    if (parts.length > 2) {
      // Убираем последнюю часть (обычно имя преподавателя)
      subtitle = parts.slice(1, -1).join(' / ').trim();
    } else {
      subtitle = parts.slice(1).join(' / ').trim();
    }
    return { title, subtitle };
  }
  return { title: name.trim(), subtitle: '' };
};