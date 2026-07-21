// src/api/purchases.ts

import { apiClient } from './apiClient';
import { getToken } from '../utils/token';

// Получить данные пользователя (с его курсами)
export const fetchUserCourses = async (): Promise<{ selectedCourses?: string[] }> => {
  const token = getToken();
  return apiClient.get('/api/fitness/users/me', token || undefined);
};

// Проверить, есть ли курс у пользователя
export const checkUserHasCourse = async (courseId: string): Promise<boolean> => {
  try {
    const userData = await fetchUserCourses();
    return userData.selectedCourses?.includes(courseId) || false;
  } catch {
    return false;
  }
};

// Добавить курс
export const addCourseToUser = async (courseId: string): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Не авторизован');
  await apiClient.post('/api/fitness/users/me/courses', { courseId }, token);
};

// Удалить курс
export const removeCourseFromUser = async (courseId: string): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Не авторизован');
  await apiClient.delete(`/api/fitness/users/me/courses/${courseId}`, token);
};