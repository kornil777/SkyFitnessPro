import { apiClient } from './apiClient';

export interface UserProfile {
  email: string;
  selectedCourses: string[];
}

export const fetchUserProfile = (): Promise<UserProfile> => {
  return apiClient.get<UserProfile>('/users/me');
};

export const addCourseToUser = (courseId: string): Promise<{ message: string }> => {
  return apiClient.post('/users/me/courses', { courseId });
};

export const removeCourseFromUser = (courseId: string): Promise<{ message: string }> => {
  return apiClient.delete(`/users/me/courses/${courseId}`);
};