// src/api/apiClient.ts

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  get: async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { headers });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}`);
    }
    return response.json();
  },
  post: async <T>(endpoint: string, data: any, token?: string): Promise<T> => {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}`);
    }
    return response.json();
  },
  delete: async <T>(endpoint: string, token?: string): Promise<T> => {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}`);
    }
    return response.json();
  },
  patch: async <T>(endpoint: string, data: any, token?: string): Promise<T> => {
    const headers: HeadersInit = {
      'Accept': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Ошибка ${response.status}`);
    }
    return response.json();
  },
};