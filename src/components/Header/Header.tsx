import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserProfile from '../UserProfile/UserProfile';
import styles from './Header.module.css';

interface HeaderProps {
  showAuthButton?: boolean; // показывать кнопку "Войти" или профиль
}

const Header: React.FC<HeaderProps> = ({ showAuthButton = true }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleProfileClick = () => navigate('/profile');
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleAddCourse = () => navigate('/');
  const handleLoginClick = () => navigate('/auth');

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink}>
        <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />
      </Link>
      <div className={styles.rightSection}>
        {showAuthButton && (
          isAuthenticated ? (
            <UserProfile
              userName={user?.name || ''}
              userEmail={user?.email || ''}
              onProfileClick={handleProfileClick}
              onLogout={handleLogout}
              onAddCourse={handleAddCourse}
            />
          ) : (
            <button className={styles.loginButton} onClick={handleLoginClick}>
              Войти
            </button>
          )
        )}
      </div>
    </header>
  );
};

export default Header;