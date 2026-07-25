// src/api/workouts.ts

import { apiClient } from './apiClient';
import type { Workout, WorkoutProgressResponse, ProgressResponse } from '../types/course.types';

// Получить данные тренировки по ID
export const getWorkoutById = (workoutId: string): Promise<Workout> => {
  return apiClient.get(`/api/fitness/workouts/${workoutId}`);
};

// Получить прогресс по всем тренировкам курса
export const getCourseProgress = (courseId: string): Promise<ProgressResponse> => {
  return apiClient.get(`/api/fitness/users/me/progress?courseId=${courseId}`);
};

// Получить прогресс по конкретной тренировке
export const getWorkoutProgress = (courseId: string, workoutId: string): Promise<WorkoutProgressResponse> => {
  return apiClient.get(`/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`);
};

// Сохранить прогресс тренировки
export const saveWorkoutProgress = (courseId: string, workoutId: string, progressData: number[]) => {
  return apiClient.patch(`/api/fitness/courses/${courseId}/workouts/${workoutId}`, { progressData });
};

// Сбросить прогресс тренировки
export const resetWorkoutProgress = (courseId: string, workoutId: string) => {
  return apiClient.patch(`/api/fitness/courses/${courseId}/workouts/${workoutId}/reset`, {});
};