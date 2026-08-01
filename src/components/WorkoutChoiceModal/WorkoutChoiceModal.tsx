import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { getCourseWorkouts } from '../../api/workouts';
import { getCourseProgress } from '../../api/progress';
import type { Workout } from '../../types/course.types';
import styles from './WorkoutChoiceModal.module.css';
import Loader from '../Loader/Loader';

interface WorkoutChoiceModalProps {
  courseId: string;
  onClose: () => void;
}

const WorkoutChoiceModal: React.FC<WorkoutChoiceModalProps> = ({ courseId, onClose }) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [workoutsData, progressData] = await Promise.all([
          getCourseWorkouts(courseId),
          getCourseProgress(courseId).catch(() => null),
        ]);

        // Сортировка
        const sorted = workoutsData.sort((a, b) => {
          const numA = extractNumber(a.name);
          const numB = extractNumber(b.name);
          return numA - numB;
        });
        setWorkouts(sorted);

        // Определяем завершённые тренировки
        if (progressData && progressData.workoutsProgress) {
          const completedIds = progressData.workoutsProgress
            .filter(w => w.workoutCompleted === true)
            .map(w => w.workoutId);
          setCompletedWorkoutIds(completedIds);
        }

        if (sorted.length > 0) {
          setSelectedWorkoutId(sorted[0]._id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  const extractNumber = (name: string): number => {
    const match = name.match(/\d+/);
    return match ? parseInt(match[0], 10) : Infinity;
  };

  const handleSelect = (workoutId: string) => {
    setSelectedWorkoutId(workoutId);
  };

  const handleStart = () => {
    if (selectedWorkoutId && courseId) {
      navigate(`/training/${courseId}/${selectedWorkoutId}`);
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const splitWorkoutName = (name: string) => {
    const parts = name.split(' / ');
    if (parts.length >= 2) {
      const title = parts[0].trim();
      let subtitle = '';
      if (parts.length > 2) {
        subtitle = parts.slice(1, -1).join(' / ').trim();
      } else {
        subtitle = parts.slice(1).join(' / ').trim();
      }
      return { title, subtitle };
    }
    return { title: name.trim(), subtitle: '' };
  };

  if (loading) return <Loader fullPage />;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Выберите тренировку</h2>
        <ul className={styles.list}>
          {workouts.map((workout) => {
            const { title, subtitle } = splitWorkoutName(workout.name);
            const isSelected = selectedWorkoutId === workout._id;
            const isCompleted = completedWorkoutIds.includes(workout._id);
            return (
              <li
                key={workout._id}
                className={`${styles.item} ${isSelected ? styles.selected : ''} ${isCompleted ? styles.completed : ''}`}
                onClick={() => handleSelect(workout._id)}
              >
                <div className={styles.iconWrapper}>
                  <div className={styles.circle}>
                    {isCompleted && (
                      <img
                        src="images/check.svg"
                        alt="✓"
                        className={styles.checkIcon}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.textBlock}>
                  <span className={styles.titleText}>{title}</span>
                  {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
                </div>
                
              </li>
            );
          })}
        </ul>
        <button
          className={styles.startButton}
          onClick={handleStart}
          disabled={!selectedWorkoutId}
        >
          Начать
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default WorkoutChoiceModal;