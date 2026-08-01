// src/components/ProfileModal/ProfileModal.tsx

import React from 'react';
import styles from './ProfileModal.module.css';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  onProfileClick: () => void;
  onLogout: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  userName,
  userEmail,
  onProfileClick,
  onLogout,
}) => {
  if (!isOpen) return null;

  const handleProfileClick = () => {
    onProfileClick();
    onClose();
  };

  const handleLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.userInfoContainer}>
        <span className={styles.userName}>{userName}</span>
        <span className={styles.userEmail}>{userEmail}</span>
      </div>
      <div className={styles.buttonsContainer}>
        <button className={styles.profileButton} onClick={handleProfileClick}>
          Профиль
        </button>
        <button className={styles.logoutButton} onClick={handleLogout}>
          Выйти
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;