// src/api/purchases.ts

import { apiClient } from './apiClient';
import type { UserApiResponse } from '../types/user.types';
import { extractUserData } from '../types/user.types';

// Получить данные пользователя (включая список курсов)
export const fetchUserData = async (): Promise<UserApiResponse> => {
  const response = await apiClient.get('/api/fitness/users/me');
  const data = extractUserData(response);
  if (!data || !data.email) {
    throw new Error('Invalid user data structure');
  }
  return data;
};

// Проверить, есть ли курс у пользователя
export const checkUserHasCourse = async (courseId: string): Promise<boolean> => {
  try {
    const userData = await fetchUserData();
    return userData.selectedCourses?.includes(courseId) || false;
  } catch {
    return false;
  }
};

// Добавить курс
export const addCourseToUser = (courseId: string) => {
  return apiClient.post('/api/fitness/users/me/courses', { courseId });
};

// Удалить курс
export const removeCourseFromUser = (courseId: string) => {
  return apiClient.delete(`/api/fitness/users/me/courses/${courseId}`);
};