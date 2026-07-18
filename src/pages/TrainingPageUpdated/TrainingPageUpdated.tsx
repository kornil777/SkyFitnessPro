// src/pages/TrainingPageUpdated/TrainingPageUpdated.tsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./TrainingPageUpdated.module.css";

const TrainingPageUpdated: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();

  const handleProfileClick = () => navigate("/profile");
  const handleAddCourse = () => navigate("/");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleUpdateProgress = () => navigate(`/training/${id}/progress`);

  const exercises = [
    { name: "Наклоны вперед", progress: 40 },
    { name: "Наклоны назад", progress: 40 },
    { name: "Поднятие ног, согнутых в коленях", progress: 40 },
    { name: "Наклоны вперед", progress: 40 },
    { name: "Наклоны назад", progress: 40 },
    { name: "Поднятие ног, согнутых в коленях", progress: 40 },
    { name: "Наклоны вперед", progress: 40 },
    { name: "Наклоны назад", progress: 40 },
    { name: "Поднятие ног, согнутых в коленях", progress: 40 },
  ];

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
                <div key={col} className={`${styles.exerciseColumn} ${col === 2 ? styles.exerciseColumnLarge : styles.exerciseColumnDefault}`}>
                  {[0, 1, 2].map((row) => {
                    const idx = col * 3 + row;
                    const item = exercises[idx];
                    const isLarge = (col === 2 && row === 2);
                    return (
                      <div key={row} className={isLarge ? styles.exerciseItemLarge : styles.exerciseItem}>
                        <p className={isLarge ? styles.exerciseTextLarge : styles.exerciseText}>
                          {item.name} {item.progress}%
                        </p>
                        <div className={styles.progressBarBg}>
                          <div className={styles.progressBarFill} style={{ width: `${item.progress}%`, background: "#00C1FF" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <button className={styles.progressButton} onClick={handleUpdateProgress}>
              Обновить свой прогресс
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPageUpdated;