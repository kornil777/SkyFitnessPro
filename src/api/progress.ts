import { apiClient } from './apiClient';

export interface WorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

export interface CourseProgressResponse {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgress[];
}

// Получить прогресс по всем тренировкам курса
export const getCourseProgress = (courseId: string): Promise<CourseProgressResponse> => {
  return apiClient.get(`/api/fitness/users/me/progress?courseId=${courseId}`);
};