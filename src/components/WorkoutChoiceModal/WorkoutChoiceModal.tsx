import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCourseWorkouts } from '../../api/workouts';
import type { Workout } from '../../types/course.types';
import styles from './WorkoutChoiceModal.module.css';

interface WorkoutChoiceModalProps {
  courseId: string;
  onClose: () => void;
}

const WorkoutChoiceModal: React.FC<WorkoutChoiceModalProps> = ({ courseId, onClose }) => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      try {
        const data = await getCourseWorkouts(courseId);
        setWorkouts(data);
        if (data.length > 0) {
          setSelectedWorkoutId(data[0]._id);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки тренировок');
      } finally {
        setLoading(false);
      }
    };
    loadWorkouts();
  }, [courseId]);

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

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>✕</button>
        <h2 className={styles.title}>Выберите тренировку</h2>
        <ul className={styles.list}>
          {workouts.map((workout) => {
            const { title, subtitle } = splitWorkoutName(workout.name);
            const isSelected = selectedWorkoutId === workout._id;
            return (
              <li
                key={workout._id}
                className={`${styles.item} ${isSelected ? styles.selected : ''}`}
                onClick={() => handleSelect(workout._id)}
              >
                <div className={styles.iconWrapper}>
                  <div className={styles.circle}>
                    {isSelected && (
                      <img
                        src="/images/check.svg"
                        alt="✓"
                        className={styles.checkIcon}
                      />
                    )}
                  </div>
                </div>
                <div className={styles.textBlock}>
                  <span className={styles.title}>{title}</span>
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
};

export default WorkoutChoiceModal;