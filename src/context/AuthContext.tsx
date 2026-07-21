// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../api/apiClient';

interface User {
  id: string;
  email: string;
  name: string;
  selectedCourses?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      const savedUserStr = localStorage.getItem('user');
      
      if (token && savedUserStr) {
        try {
          const savedUser: User = JSON.parse(savedUserStr);
          // Пробуем получить свежие данные
          const userData = await apiClient.get('/api/fitness/users/me');
          console.log('Restore session userData:', userData);
          
          // Пытаемся извлечь данные из возможных обёрток
          const data = extractUserData(userData);
          if (data && data.email) {
            setUser({
              id: data.id || data._id || savedUser.id || '',
              email: data.email,
              name: data.name || savedUser.name || '',
              selectedCourses: data.selectedCourses || savedUser.selectedCourses || [],
            });
          } else {
            // Если данные невалидны, используем сохранённые
            setUser(savedUser);
          }
        } catch (error) {
          console.warn('Session restore failed, using saved user', error);
          // Если запрос упал, используем сохранённого пользователя
          try {
            const savedUser: User = JSON.parse(savedUserStr);
            setUser(savedUser);
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // Вспомогательная функция для извлечения данных из ответа
  const extractUserData = (response: any): any => {
    if (!response) return null;
    // Если ответ имеет поле user, data или result
    if (response.user) return response.user;
    if (response.data) return response.data;
    if (response.result) return response.result;
    // Если сам ответ содержит email
    if (response.email) return response;
    // Если массив, берём первый
    if (Array.isArray(response) && response.length > 0) return response[0];
    return null;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loginResponse = await apiClient.post<{ token: string }>('/api/fitness/auth/login', { email, password });
      const { token } = loginResponse;
      localStorage.setItem('token', token);
      
      const userData = await apiClient.get('/api/fitness/users/me');
      console.log('Login userData:', userData);
      
      const data = extractUserData(userData);
      if (!data || !data.email) {
        console.warn('No email in userData, using fallback');
        // Используем данные из запроса, но сохраняем только email из формы
        const userObj: User = {
          id: data?._id || data?.id || '',
          email: email, // берём из формы
          name: data?.name || '',
          selectedCourses: data?.selectedCourses || [],
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        return true;
      }
      
      const userObj: User = {
        id: data._id || data.id || '',
        email: data.email,
        name: data.name || '',
        selectedCourses: data.selectedCourses || [],
      };
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      await apiClient.post('/api/fitness/auth/register', { email, password });
      
      const loginResponse = await apiClient.post<{ token: string }>('/api/fitness/auth/login', { email, password });
      localStorage.setItem('token', loginResponse.token);
      
      const userData = await apiClient.get('/api/fitness/users/me');
      console.log('Register userData:', userData);
      
      const data = extractUserData(userData);
      if (!data || !data.email) {
        // fallback
        const userObj: User = {
          id: data?._id || data?.id || '',
          email: email,
          name: name,
          selectedCourses: data?.selectedCourses || [],
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        return true;
      }
      
      const userObj: User = {
        id: data._id || data.id || '',
        email: data.email,
        name: name, // используем переданное имя
        selectedCourses: data.selectedCourses || [],
      };
      
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};