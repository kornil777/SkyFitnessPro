import { apiClient } from './apiClient';

export interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

export interface Exercise {
  name: string;
  quantity: number;
  _id: string;
}

export const fetchWorkoutById = (workoutId: string): Promise<Workout> => {
  return apiClient.get<Workout>(`/workouts/${workoutId}`);
};