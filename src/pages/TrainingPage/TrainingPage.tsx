// src/pages/TrainingPage/TrainingPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getWorkoutById, getWorkoutProgress } from '../../api/workouts';
import UserProfile from '../../components/UserProfile/UserProfile';
import type { Workout, WorkoutProgressResponse } from '../../types/course.types';
import styles from './TrainingPage.module.css';

const TrainingPage: React.FC = () => {
  const navigate = useNavigate();
  const { courseId, workoutId } = useParams<{ courseId: string; workoutId: string }>();
  const { user, logout } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [progress, setProgress] = useState<WorkoutProgressResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!workoutId || !courseId) {
        setError('Недостаточно параметров');
        setLoading(false);
        return;
      }
      try {
        // Загружаем данные тренировки
        const workoutData = await getWorkoutById(workoutId);
        setWorkout(workoutData);

        // Загружаем прогресс (если пользователь авторизован)
        if (user) {
          try {
            const progressData = await getWorkoutProgress(courseId, workoutId);
            setProgress(progressData);
          } catch (err) {
            // Если прогресса нет, просто игнорируем
            console.warn('Прогресс не найден', err);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки тренировки');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [workoutId, courseId, user]);

  const handleProfileClick = () => navigate('/profile');
  const handleAddCourse = () => navigate('/');
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleOpenProgress = () => {
    navigate(`/training/${courseId}/${workoutId}/progress`);
  };

  if (loading) return <div className={styles.loading}>Загрузка тренировки...</div>;
  if (error || !workout) return <div className={styles.error}>Ошибка: {error || 'Тренировка не найдена'}</div>;

  // Вычисляем общий прогресс для отображения (сумма повторений или процент)
  const totalProgress = progress?.progressData?.length
    ? Math.round((progress.progressData.reduce((a, b) => a + b, 0) / (workout.exercises.length * 10)) * 100)
    : 0;

  return (
    <div className={styles.page}>
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
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.videoIframe}
          />
        </div>

        <div className={styles.exercisesBlock}>
          <div className={styles.exercisesContent}>
            <h2 className={styles.exercisesTitle}>Упражнения тренировки</h2>
            <div className={styles.exercisesGrid}>
              {workout.exercises.map((exercise, index) => {
                const progressValue = progress?.progressData?.[index] || 0;
                const maxQuantity = exercise.quantity || 10;
                const percent = Math.min(Math.round((progressValue / maxQuantity) * 100), 100);
                return (
                  <div key={exercise._id} className={styles.exerciseItem}>
                    <p className={styles.exerciseText}>
                      {exercise.name} ({percent}%)
                    </p>
                    <div className={styles.progressBarBg}>
                      <div className={styles.progressBarFill} style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                );
              })}
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