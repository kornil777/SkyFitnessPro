// src/pages/AuthPage/AuthPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCourses } from '../../api/courses';
import Login from '../../components/Login/Login';
import Register from '../../components/Register/Register';
import CourseCard from '../../components/CourseCard/CourseCard';
import type { Course } from '../../types/course.types';
import styles from './AuthPage.module.css';

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Если пользователь уже авторизован, редирект на главную
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Загружаем курсы для фона
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch {
        // если ошибка, просто оставляем пустой массив
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, []);

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const success = await onLogin(email, password);
      if (success) {
        navigate('/');
      } else {
        setErrorMessage('Неверный email или пароль');
      }
    } catch {
      setErrorMessage('Ошибка при входе');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const success = await onRegister(email, password, name);
      if (success) {
        setShowSuccessMessage(true);
        setIsLogin(true);
        setErrorMessage(null);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } else {
        setErrorMessage('Пользователь с таким email уже существует');
      }
    } catch {
      setErrorMessage('Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    navigate('/');
  };

  return (
    <div className={styles.page}>
      {/* Фон с курсами */}
      <div className={styles.backgroundContent}>
        <div className={styles.headerPlaceholder} />
        <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>
        <h1 className={styles.title}>
          Начните заниматься спортом
          <br />и улучшите качество жизни
        </h1>
        <img
          src="/images/Group.svg"
          alt="Измени своё тело за полгода"
          className={styles.greenBlock}
        />
        <div className={styles.coursesGrid}>
          {!loadingCourses && courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isAuthenticated={false}
            />
          ))}
        </div>
      </div>

      {/* Оверлей с формой */}
<div className={styles.authOverlay} onClick={handleCloseModal}>
  <div className={styles.authContainer} onClick={(e) => e.stopPropagation()}>
    {/* Крестик для закрытия */}
    <button className={styles.closeButton} onClick={handleCloseModal}>
      ✕
    </button>

    <div className={styles.toggleButtons}>
      <button
        className={`${styles.toggleButton} ${isLogin ? styles.activeToggle : ''}`}
        onClick={() => { setIsLogin(true); setErrorMessage(null); setShowSuccessMessage(false); }}
      >
        Вход
      </button>
      <button
        className={`${styles.toggleButton} ${!isLogin ? styles.activeToggle : ''}`}
        onClick={() => { setIsLogin(false); setErrorMessage(null); setShowSuccessMessage(false); }}
      >
        Регистрация
      </button>
    </div>

    {showSuccessMessage && (
      <div className={styles.successMessage}>Регистрация успешна! Теперь вы можете войти.</div>
    )}

    {isLogin ? (
      <Login
        onSwitchToRegister={() => { setIsLogin(false); setErrorMessage(null); }}
        onClose={handleCloseModal}
        onLogin={handleLoginSubmit}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
    ) : (
      <Register
        onSwitchToLogin={() => { setIsLogin(true); setErrorMessage(null); }}
        onClose={handleCloseModal}
        onRegister={handleRegisterSubmit}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
    )}
  </div>
</div>

      {/* Кнопка "Наверх" (оставляем, если нужна) */}
      <button
        className={styles.scrollButton}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span className={styles.arrow}>↑</span>
        <span>Наверх</span>
      </button>
    </div>
  );
};

export default AuthPage;