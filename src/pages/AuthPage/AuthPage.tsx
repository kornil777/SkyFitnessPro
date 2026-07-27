// src/pages/AuthPage/AuthPage.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Login/Login";
import Register from "../../components/Register/Register";
import styles from "./AuthPage.module.css";
import Header from "../../components/Header/Header";

interface AuthPageProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const success = await onLogin(email, password);
      if (success) {
        navigate("/");
      } else {
        setErrorMessage("Неверный email или пароль");
      }
    } catch {
      setErrorMessage("Ошибка при входе");
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
        setErrorMessage("Пользователь с таким email уже существует");
      }
    } catch {
      setErrorMessage("Ошибка при регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
       <Header showAuthButton={false} />
  <p className={styles.subtitle}>...</p>
  <h1 className={styles.title}>...</h1>
     
      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>
      {/* Заголовок */}
      <h1 className={styles.title}>
        Начните заниматься спортом
        <br />и улучшите качество жизни
      </h1>
      {/* Зеленый блок с текстом */}
      <img src="/images/Group.svg" alt="Измени своё тело за полгода" className={styles.greenBlock} />

      {/* Оверлей с формой */}
      <div className={styles.authOverlay}>
        <div className={styles.authContainer}>
          <div className={styles.toggleButtons}>
            <button
              className={`${styles.toggleButton} ${isLogin ? styles.activeToggle : ""}`}
              onClick={() => { setIsLogin(true); setErrorMessage(null); setShowSuccessMessage(false); }}
            >
              Вход
            </button>
            <button
              className={`${styles.toggleButton} ${!isLogin ? styles.activeToggle : ""}`}
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
              onClose={() => navigate("/")}
              onLogin={handleLoginSubmit}
              errorMessage={errorMessage}
              isLoading={isLoading}
            />
          ) : (
            <Register
              onSwitchToLogin={() => { setIsLogin(true); setErrorMessage(null); }}
              onClose={() => navigate("/")}
              onRegister={handleRegisterSubmit}
              errorMessage={errorMessage}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Кнопка "Наверх" */}
      <button
        className={styles.scrollButton}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <span className={styles.arrow}>↑</span>
        <span>Наверх</span>
      </button>
    </div>
  );
};

export default AuthPage;