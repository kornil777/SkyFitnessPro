// src/types/course.types.ts

export interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

export interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

export interface Course {
  _id: string;                // ID из БД
  nameRU: string;             // русское название
  nameEN: string;             // английское название
  description: string;
  directions: string[];       // направления (массив строк)
  fitting: string[];          // для кого подходит
  difficulty: string;         // сложность
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[];         // массив ID тренировок
  image?: string;             // добавим для совместимости с вёрсткой, если будет
}

// Для ответа /courses/[id]/workouts
export interface WorkoutDetail extends Workout {} // можно просто использовать Workout

// Для пользователя (для других страниц)
export interface UserProfile {
  email: string;
  selectedCourses: string[];  // массив ID курсов
}