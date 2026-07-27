// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../api/apiClient';
import { extractUserData } from '../types/user.types';

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
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Вспомогательная функция для получения сохранённого имени
  const getStoredName = (): string => {
    return localStorage.getItem('userName') || '';
  };

  // Вспомогательная функция для сохранения имени
  const setStoredName = (name: string) => {
    localStorage.setItem('userName', name);
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      const savedUserStr = localStorage.getItem('user');

      if (token && savedUserStr) {
        try {
          const savedUser: User = JSON.parse(savedUserStr);
          const response = await apiClient.get('/api/fitness/users/me');
          const data = extractUserData(response);
          if (data && data.email) {
            // Берём имя из сохранённого пользователя, если сервер не вернул, или из отдельного хранилища
            const name = data.name || savedUser.name || getStoredName() || '';
            setUser({
              id: data._id || data.id || savedUser.id || '',
              email: data.email,
              name: name,
              selectedCourses: data.selectedCourses || savedUser.selectedCourses || [],
            });
          } else {
            setUser(savedUser);
          }
        } catch {
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

  const refreshUser = async () => {
    if (!user) return;
    try {
      const response = await apiClient.get('/api/fitness/users/me');
      const data = extractUserData(response);
      if (data && data.email) {
        const updatedUser: User = {
          ...user,
          selectedCourses: data.selectedCourses || user.selectedCourses || [],
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loginResponse = await apiClient.post<{ token: string }>('/api/fitness/auth/login', { email, password });
      const { token } = loginResponse;
      localStorage.setItem('token', token);

      const response = await apiClient.get('/api/fitness/users/me');
      const data = extractUserData(response);

      // Берём имя из отдельного хранилища или из данных сервера
      const name = data?.name || getStoredName() || '';

      const userObj: User = {
        id: data?._id || data?.id || '',
        email: data?.email || email,
        name: name,
        selectedCourses: data?.selectedCourses || [],
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      // Сохраняем имя отдельно на случай, если сервер не возвращает
      if (name) setStoredName(name);
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

      const response = await apiClient.get('/api/fitness/users/me');
      const data = extractUserData(response);

      const userObj: User = {
        id: data?._id || data?.id || '',
        email: data?.email || email,
        name: data?.name || name,
        selectedCourses: data?.selectedCourses || [],
      };

      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      // Сохраняем имя отдельно
      setStoredName(userObj.name);
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
    // НЕ удаляем userName, чтобы он сохранился
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, refreshUser }}>
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