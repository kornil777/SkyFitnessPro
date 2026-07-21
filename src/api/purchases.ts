// src/api/purchases.ts

import { apiClient } from './apiClient';
import type { UserProfileResponse } from '../types/user.types';

// Получить данные пользователя (включая список курсов)
export const fetchUserData = (): Promise<UserProfileResponse> => {
  return apiClient.get<UserProfileResponse>('/api/fitness/users/me');
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