import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema} from '../../validation/auth.schema';
import type { RegisterFormData } from '../../validation/auth.schema';
import styles from './Register.module.css';

interface RegisterProps {
  onSwitchToLogin: () => void;
  onClose: () => void;
  onRegister: (email: string, password: string, name: string) => void;
  errorMessage?: string | null;
  isLoading?: boolean;
}

const Register: React.FC<RegisterProps> = ({
  onSwitchToLogin,
  onClose,
  onRegister,
  errorMessage,
  isLoading = false,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    onRegister(data.email, data.password, data.name);
  };

  return (
    <div className={styles.registerContainer}>
      <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />

      <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="Имя"
          className={styles.inputField}
          {...register('name')}
        />
        {errors.name && (
          <span className={styles.errorText}>{errors.name.message}</span>
        )}

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

        <input
          type="password"
          placeholder="Повторить пароль"
          className={styles.inputField}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <span className={styles.errorText}>{errors.confirmPassword.message}</span>
        )}

        {errorMessage && (
          <div className={styles.errorMessage}>{errorMessage}</div>
        )}

        <button
          type="submit"
          className={styles.registerButton}
          disabled={isLoading}
        >
          {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  );
};

export default Register;