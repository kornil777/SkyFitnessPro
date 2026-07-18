// src/pages/TrainingPageWithModal/TrainingPageWithModal.tsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/UserProfile/UserProfile";
import styles from "./TrainingPageWithModal.module.css";

const TrainingPageWithModal: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();

  const [progressItems, setProgressItems] = useState([
    { id: 1, question: "Сколько раз вы сделали наклоны вперед?", value: 20 },
    { id: 2, question: "Сколько раз вы сделали наклоны назад?", value: 0 },
    { id: 3, question: "Сколько раз вы сделали поднятие ног, согнутых в коленях?", value: 0 },
  ]);

  const handleProfileClick = () => navigate("/profile");
  const handleAddCourse = () => navigate("/");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleInputChange = (id: number, value: string) => {
    const numValue = parseInt(value) || 0;
    setProgressItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value: numValue } : item))
    );
  };

  const handleSave = () => {
    console.log("Saved progress:", progressItems);
    navigate(`/training/${id}/success`);
  };

  const handleCloseModal = () => navigate(`/training/${id}`);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageOverlay} onClick={handleOverlayClick} />
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
            <button className={styles.progressButton} onClick={() => {}}>
              Заполнить свой прогресс
            </button>
          </div>
        </div>
      </div>

      <div className={styles.modalContainer}>
        <h2 className={styles.modalTitle}>Мой прогресс</h2>
        <div className={styles.scrollableContent}>
          {progressItems.map((item) => (
            <div key={item.id} className={styles.progressItem}>
              <p className={styles.questionText}>{item.question}</p>
              <input
                type="number"
                className={styles.inputField}
                value={item.value}
                onChange={(e) => handleInputChange(item.id, e.target.value)}
                min="0"
              />
            </div>
          ))}
        </div>
        <button className={styles.saveButton} onClick={handleSave}>Сохранить</button>
      </div>
    </div>
  );
};

export default TrainingPageWithModal;