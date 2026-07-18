// src/pages/TrainingPage/TrainingPage.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./TrainingPage.module.css";

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();

  const handleProfileClick = () => navigate("/profile");
  const handleAddCourse = () => navigate("/");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleOpenProgress = () => navigate(`/training/${id}/progress`);

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

      <div className={styles.contentBlock}>
        <h1 className={styles.title}>Йога</h1>
        <div className={styles.videoContainer}>
          <img src="/images/vid1.svg" alt="Video" className={styles.videoImage} />
        </div>
        <div className={styles.exercisesBlock}>
          <div className={styles.exercisesContent}>
            <h2 className={styles.exercisesTitle}>Упражнения тренировки 2</h2>
            <div className={styles.exercisesGrid}>
              {[0, 1, 2].map((col) => (
                <div key={col} className={styles.exerciseColumn}>
                  <div className={styles.exerciseItem}>
                    <p className={styles.exerciseText}>Наклоны вперед 0%</p>
                    <div className={styles.progressBarBg}>
                      <div className={styles.progressBarFill} style={{ width: "0%" }} />
                    </div>
                  </div>
                  <div className={styles.exerciseItem}>
                    <p className={styles.exerciseText}>Наклоны назад 0%</p>
                    <div className={styles.progressBarBg}>
                      <div className={styles.progressBarFill} style={{ width: "0%" }} />
                    </div>
                  </div>
                  <div className={styles.exerciseItem}>
                    <p className={styles.exerciseText}>Поднятие ног, согнутых в коленях 0%</p>
                    <div className={styles.progressBarBg}>
                      <div className={styles.progressBarFill} style={{ width: "0%" }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className={styles.progressButton} onClick={handleOpenProgress}>
              Заполнить свой прогресс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;