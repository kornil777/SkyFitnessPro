// src/pages/TrainingPageWithModal/TrainingPageWithModal.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getWorkoutById, getWorkoutProgress, saveWorkoutProgress } from '../../api/workouts';
import UserProfile from '../../components/UserProfile/UserProfile';
import type { Workout } from '../../types/course.types';
import styles from './TrainingPageWithModal.module.css';

const TrainingPageWithModal: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, workoutId } = useParams<{ courseId: string; workoutId: string }>();
  const { user, logout } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);
  const [progressValues, setProgressValues] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId || !courseId) return;
      try {
        const data = await getWorkoutById(workoutId);
        setWorkout(data);

        // Загружаем существующий прогресс
        try {
          const progressData = await getWorkoutProgress(courseId, workoutId);
          if (progressData && progressData.progressData) {
            setProgressValues(progressData.progressData);
          } else {
            setProgressValues(data.exercises.map(() => 0));
          }
        } catch {
          setProgressValues(data.exercises.map(() => 0));
        }
      } catch (error) {
        console.error('Failed to load workout:', error);
      } finally {
        setLoading(false);
      }
    };
    loadWorkout();
  }, [workoutId, courseId]);

  const handleProfileClick = () => navigate('/profile');
  const handleAddCourse = () => navigate('/');
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleInputChange = (index: number, value: string) => {
    const num = parseInt(value) || 0;
    const newValues = [...progressValues];
    newValues[index] = num;
    setProgressValues(newValues);
  };

  const handleSave = async () => {
    if (!workout || !courseId || !workoutId) return;
    setSaving(true);
    try {
      await saveWorkoutProgress(courseId, workoutId, progressValues);
      navigate(`/training/${courseId}/${workoutId}/success`);
    } catch (error) {
      console.error('Failed to save progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => navigate(`/training/${courseId}/${workoutId}`);
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) handleCloseModal();
  };

  if (loading) return <div>Загрузка...</div>;
  if (!workout) return <div>Тренировка не найдена</div>;

  return (
    <div className={styles.page}>
      <div className={styles.pageOverlay} onClick={handleOverlayClick} />
      <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />
      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={user?.name || ''}
          userEmail={user?.email || ''}
          onProfileClick={handleProfileClick}
          onLogout={handleLogout}
          onAddCourse={handleAddCourse}
        />
      </div>

      <div className={styles.contentBlock}>
        <h1 className={styles.title}>{workout.name}</h1>
        <div className={styles.videoContainer}>
          <iframe
            width="1160"
            height="639"
            src={workout.video}
            title={workout.name}
            frameBorder="0"
            allowFullScreen
            className={styles.videoIframe}
          />
        </div>
        <div className={styles.exercisesBlock}>
          <div className={styles.exercisesContent}>
            <h2 className={styles.exercisesTitle}>Упражнения тренировки</h2>
            <div className={styles.exercisesGrid}>
              {workout.exercises.map((exercise, index) => (
                <div key={exercise._id} className={styles.exerciseItem}>
                  <p className={styles.exerciseText}>{exercise.name}</p>
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
          {workout.exercises.map((exercise, index) => (
            <div key={exercise._id} className={styles.progressItem}>
              <p className={styles.questionText}>{exercise.name}</p>
              <input
                type="number"
                className={styles.inputField}
                value={progressValues[index] || 0}
                onChange={(e) => handleInputChange(index, e.target.value)}
                min="0"
              />
            </div>
          ))}
        </div>
        <button className={styles.saveButton} onClick={handleSave} disabled={saving}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </div>
  );
};

export default TrainingPageWithModal;