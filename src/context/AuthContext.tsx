// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiClient } from '../api/apiClient';
import { extractUserData } from '../types/user.types';
import type { UserApiResponse } from '../types/user.types';

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
          const response = await apiClient.get('/api/fitness/users/me');
          const data = extractUserData(response);
          if (data && data.email) {
            setUser({
              id: data._id || data.id || savedUser.id || '',
              email: data.email,
              name: data.name || savedUser.name || '',
              selectedCourses: data.selectedCourses || savedUser.selectedCourses || [],
            });
          } else {
            // Если данные невалидны, используем сохранённые
            setUser(savedUser);
          }
        } catch {
          // Если запрос упал, используем сохранённого пользователя, если он есть
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loginResponse = await apiClient.post<{ token: string }>('/api/fitness/auth/login', { email, password });
      const { token } = loginResponse;
      localStorage.setItem('token', token);
      
      const response = await apiClient.get('/api/fitness/users/me');
      const data = extractUserData(response);
      
      if (!data || !data.email) {
        // Fallback
        const userObj: User = {
          id: '',
          email: email,
          name: '',
          selectedCourses: [],
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
      
      const response = await apiClient.get('/api/fitness/users/me');
      const data = extractUserData(response);
      
      if (!data || !data.email) {
        // Fallback
        const userObj: User = {
          id: '',
          email: email,
          name: name,
          selectedCourses: [],
        };
        setUser(userObj);
        localStorage.setItem('user', JSON.stringify(userObj));
        return true;
      }
      
      const userObj: User = {
        id: data._id || data.id || '',
        email: data.email,
        name: name,
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