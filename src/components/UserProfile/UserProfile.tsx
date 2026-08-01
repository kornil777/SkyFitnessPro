// src/components/UserProfile/UserProfile.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../ProfileModal/ProfileModal';
import styles from './UserProfile.module.css';

interface UserProfileProps {
  userName: string;
  userEmail: string;
  onProfileClick?: () => void;
  onLogout?: () => void;
  onAddCourse?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  userName,
  userEmail,
  onProfileClick,
  onLogout,
  onAddCourse,
}) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    const isMobile = window.matchMedia('(max-width: 480px)').matches;
    if (isMobile) {
      navigate('/profile');
    } else {
      setIsModalOpen(!isModalOpen);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileClick = () => {
    setIsModalOpen(false);
    if (onProfileClick) onProfileClick();
  };

  const handleLogout = () => {
    setIsModalOpen(false);
    if (onLogout) onLogout();
  };

  // Закрытие при клике вне модалки (опционально)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isModalOpen]);

  return (
    <div className={styles.userProfileWrapper} ref={containerRef}>
      <div className={styles.userProfile} onClick={handleClick}>
        <div className={styles.profileIcon}>
          <img src="images/prof.svg" alt="Profile" />
        </div>
        <span className={styles.profileData}>{userName}</span>
        <div className={styles.arrowIcon} />
      </div>

      {isModalOpen && (
        <div className={styles.dropdown}>
          <ProfileModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            userName={userName}
            userEmail={userEmail}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />
        </div>
      )}
    </div>
  );
};

export default UserProfile;