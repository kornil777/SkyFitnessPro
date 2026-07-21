// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../api/apiClient';

interface User {
  id?: string;
  email: string;
  name: string;
  token?: string;
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
    // Восстанавливаем пользователя из localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.post<{ token: string }>('/api/fitness/auth/login', { email, password });
      // Предполагаем, что токен приходит, но email и имя мы не получаем. Можно запросить /users/me.
      // Пока сохраняем только email и токен
      const userData: User = { email, token: response.token, name: email.split('@')[0] };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string) => {
  // Регистрация
  await apiClient.post('/api/fitness/auth/register', { email, password });
  
  // Логин (получаем токен)
  const loginResponse = await apiClient.post<{ token: string }>('/api/fitness/auth/login', { email, password });
  const token = loginResponse.token;
  
  // Сохраняем токен
  localStorage.setItem('token', token);
  
  // Получаем данные пользователя (можно через /users/me)
  // или создаём локально
  const userData = { id: Date.now().toString(), email, name };
  setUser(userData);
  localStorage.setItem('user', JSON.stringify(userData));
  
  return true;
};

  const logout = () => {
    setUser(null);
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