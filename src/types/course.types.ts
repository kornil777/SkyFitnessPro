// src/types/course.types.ts

export interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

export interface Workout {
  _id: string;
  name: string;
  video: string; // ссылка на YouTube (embed)
  exercises: Exercise[];
}

export interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[]; // массив ID тренировок
  image?: string; // для маппинга
}

// Ответ на GET /api/fitness/users/me/progress?courseId=...
export interface ProgressResponse {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: {
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[]; // массив чисел (повторения для каждого упражнения)
  }[];
}

// Ответ на GET /api/fitness/users/me/progress?courseId=...&workoutId=...
export interface WorkoutProgressResponse {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}