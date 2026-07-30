import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../validation/auth.schema';
import type { LoginFormData } from '../../validation/auth.schema';
import styles from './Login.module.css';

interface LoginProps {
  onSwitchToRegister: () => void;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  errorMessage?: string | null;
  isLoading?: boolean;
}

const Login: React.FC<LoginProps> = ({
  onSwitchToRegister,
  onClose,
  onLogin,
  errorMessage,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    onLogin(data.email, data.password);
  };

  return (
    <div className={styles.loginContainer}>
      <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />

      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Эл.почта"
          className={styles.inputField}
          {...register('email')}
        />
        {errors.email && (
          <span className={styles.errorText}>{errors.email.message}</span>
        )}

        <input
          type="password"
          placeholder="Пароль"
          className={styles.inputField}
          {...register('password')}
        />
        {errors.password && (
          <span className={styles.errorText}>{errors.password.message}</span>
        )}

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? 'Вход...' : 'Войти'}
        </button>

        <button
          type="button"
          className={styles.registerButton}
          onClick={onSwitchToRegister}
        >
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
};

export default Login;