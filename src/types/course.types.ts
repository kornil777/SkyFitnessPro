// src/types/course.types.ts

export interface Course {
  id: number;
  title: string;
  image: string;
  duration?: string;
  timePerDay?: string;
  difficulty?: string;
  description?: string;
  lessons?: Lesson[];
  progress?: number;
}

export interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  tasks?: string[];
}

export interface User {
  id?: string;
  email: string;
  name: string;
  password?: string;
}

export interface Progress {
  userId: string;
  courseId: number;
  lessonId: number;
  completed: boolean;
  value?: number;
}