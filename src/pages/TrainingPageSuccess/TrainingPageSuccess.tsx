import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getWorkoutById, getWorkoutProgress } from '../../api/workouts';
import UserProfile from '../../components/UserProfile/UserProfile';
import type { Workout } from '../../types/course.types';
import styles from './TrainingPageSuccess.module.css';
import Header from '../../components/Header/Header';
import { splitWorkoutName } from '../../utils/splitWorkoutName';

interface TrainingPageSuccessProps {
  openAuthModal: () => void;
}

const TrainingPageSuccess: React.FC<TrainingPageSuccessProps> = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const { courseId, workoutId } = useParams<{ courseId: string; workoutId: string }>();
  const { user, logout } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [progress, setProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!workoutId || !courseId) return;
      try {
        const workoutData = await getWorkoutById(workoutId);
        setWorkout(workoutData);
        const progressData = await getWorkoutProgress(courseId, workoutId);
        setProgress(progressData.progressData || workoutData.exercises.map(() => 0));
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [workoutId, courseId]);

  const handleProfileClick = () => navigate('/profile');
  const handleAddCourse = () => navigate('/');
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleUpdateProgress = () => {
    navigate(`/training/${courseId}/${workoutId}/updated`);
  };

  if (loading) return <div>Загрузка...</div>;
  if (!workout) return <div>Тренировка не найдена</div>;

  // Функция для расчёта процента
  const getProgressPercent = (exerciseIndex: number) => {
    const maxQuantity = workout.exercises[exerciseIndex]?.quantity || 10;
    const value = progress[exerciseIndex] || 0;
    return Math.min(Math.round((value / maxQuantity) * 100), 100);
  };
  const { title, subtitle } = splitWorkoutName(workout.name);

  return (
    <div className={styles.page}>
      <Header openAuthModal={openAuthModal} />
      <div className={styles.pageOverlay} onClick={handleUpdateProgress} />
      

      <div className={styles.contentBlock}>
        <div className={styles.titleBlock}>
  <h1 className={styles.title}>{title}</h1>
  {subtitle && <span className={styles.titleSub}>{subtitle}</span>}
</div>
        
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
              {workout.exercises.map((exercise, index) => {
                const percent = getProgressPercent(index);
                return (
                  <div key={exercise._id} className={styles.exerciseItem}>
                    <p className={styles.exerciseText}>
                      {exercise.name} ({percent}%)
                    </p>
                    <div className={styles.progressBarBg}>
                      <div className={styles.progressBarFill} style={{ width: `${percent}%`, background: '#00C1FF' }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <button className={styles.progressButton} onClick={handleUpdateProgress}>
              Обновить свой прогресс
            </button>
          </div>
        </div>
      </div>

      <div className={styles.successModal}>
        <h2 className={styles.successTitle}>Ваш прогресс<br />засчитан!</h2>
        <div className={styles.iconContainer}>
          <div className={styles.successIcon}>
            <img src="/images/br1.svg" alt="Success" />
            <button 
  className={styles.backButton}
  onClick={() => navigate(`/course/${courseId}/authenticated`)}
>
  Вернуться к тренировкам
</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingPageSuccess;