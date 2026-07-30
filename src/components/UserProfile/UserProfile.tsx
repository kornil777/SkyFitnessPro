import React, { useState } from 'react';
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

  const handleClick = () => {
    const isMobile = window.matchMedia('(max-width: 480px)').matches;
    if (isMobile) {
      navigate('/profile');
    } else {
      setIsModalOpen(true);
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

  const handleAddCourse = () => {
    setIsModalOpen(false);
    if (onAddCourse) onAddCourse();
  };

  return (
    <>
      <div className={styles.userProfile} onClick={handleClick}>
        <div className={styles.profileIcon}>
          <img src="images/prof.svg" alt="Profile" />
        </div>
        <span className={styles.profileData}>{userName}</span>
        <div className={styles.arrowIcon} />
      </div>

      <ProfileModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        userName={userName}
        userEmail={userEmail}
        onProfileClick={handleProfileClick}
        onLogout={handleLogout}
      />
    </>
  );
};

export default UserProfile;