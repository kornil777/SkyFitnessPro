// src/types/user.types.ts

export interface UserApiResponse {
  _id?: string;
  id?: string;
  email: string;
  name?: string;
  selectedCourses?: string[];
}

// Если сервер может возвращать обёртку
export interface UserApiWrapper {
  user?: UserApiResponse;
  data?: UserApiResponse;
  result?: UserApiResponse;
}

// Вспомогательная функция для извлечения данных
export const extractUserData = (response: unknown): UserApiResponse | null => {
  if (!response) return null;
  // Если это объект
  if (typeof response === 'object') {
    const obj = response as any;
    // Проверяем обёртки
    if (obj.user && typeof obj.user === 'object' && obj.user.email) return obj.user;
    if (obj.data && typeof obj.data === 'object' && obj.data.email) return obj.data;
    if (obj.result && typeof obj.result === 'object' && obj.result.email) return obj.result;
    // Если сам объект содержит email
    if (obj.email) return obj as UserApiResponse;
  }
  return null;
};