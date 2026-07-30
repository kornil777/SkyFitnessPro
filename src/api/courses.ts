// src/api/courses.ts

import { apiClient } from './apiClient';
import type { Course, Workout } from '../types/course.types';

export const fetchCourses = (): Promise<Course[]> => {
  return apiClient.get('/api/fitness/courses');
};

export const fetchCourseById = (courseId: string): Promise<Course> => {
  return apiClient.get(`/api/fitness/courses/${courseId}`);
};

export const fetchCourseWorkouts = (courseId: string): Promise<Workout[]> => {
  return apiClient.get(`/api/fitness/courses/${courseId}/workouts`);
};

