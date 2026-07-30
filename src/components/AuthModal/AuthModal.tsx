import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../Login/Login';
import Register from '../Register/Register';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (email: string, password: string, name: string) => Promise<boolean>;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin, onRegister }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Если модалка закрыта, ничего не рендерим
  if (!isOpen) return null;

  const handleLoginSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const success = await onLogin(email, password);
      if (success) {
        onClose();
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
        // Не закрываем модалку, чтобы пользователь мог войти
      } else {
        setErrorMessage('Пользователь с таким email уже существует');
      }
    } catch {
      setErrorMessage('Ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>

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
            onClose={onClose}
            onLogin={handleLoginSubmit}
            errorMessage={errorMessage}
            isLoading={isLoading}
          />
        ) : (
          <Register
            onSwitchToLogin={() => { setIsLogin(true); setErrorMessage(null); }}
            onClose={onClose}
            onRegister={handleRegisterSubmit}
            errorMessage={errorMessage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

export default AuthModal;