// src/pages/CoursePageAuthenticated/CoursePageAuthenticated.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./CoursePageAuthenticated.module.css";

const CoursePageAuthenticated: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();

  const handleProfileClick = () => navigate("/profile");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleAddCourse = () => navigate("/profile");

  return (
    <div className={styles.page}>
      <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />
      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={user?.name || ""}
          userEmail={user?.email || ""}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onAddCourse={handleAddCourse}
        />
      </div>
      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>
      <img src="/images/card1.svg" alt="Course" className={styles.courseImage} />
      <h2 className={`${styles.sectionTitle} ${styles.forYouTitle}`}>Подойдет для вас, если:</h2>
      <div className={styles.blocksRow}>
        <img src="/images/block.svg" alt="Block 1" className={`${styles.block} ${styles.block1}`} />
        <img src="/images/block1.svg" alt="Block 2" className={`${styles.block} ${styles.block2}`} />
        <img src="/images/block2.svg" alt="Block 3" className={`${styles.block} ${styles.block3}`} />
      </div>
      <h2 className={`${styles.sectionTitle} ${styles.directionsTitle}`}>Направления</h2>
      <img src="/images/block3.svg" alt="Directions" className={styles.directionsImage} />
      <div className={styles.offerBlock}>
        <div className={styles.whiteBlock} />
        <div className={styles.textContent}>
          <h3 className={styles.offerTitle}>Начните путь <br />к новому телу</h3>
          <p className={styles.offerDescription}>
            проработка всех групп мышц<br />
            тренировка суставов<br />
            улучшение циркуляции крови<br />
            упражнения заряжают бодростью<br />
            помогают противостоять стрессам
          </p>
          <button className={styles.offerButton} onClick={handleAddCourse}>
            Добавить курс
          </button>
        </div>
        <img src="/images/block4.svg" alt="Decorative 1" className={styles.block4} />
        <img src="/images/block5.svg" alt="Decorative 2" className={styles.block5} />
      </div>
    </div>
  );
};

export default CoursePageAuthenticated;