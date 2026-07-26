// src/pages/WorkoutChoice/WorkoutChoice.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCourseWorkouts } from '../../api/workouts';
import type { Workout } from '../../types/course.types';
import styles from './WorkoutChoice.module.css';

const WorkoutChoice: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWorkouts = async () => {
      if (!courseId) {
        setError('ID курса не указан');
        setLoading(false);
        return;
      }
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
    }
  };

  // Функция разбивки названия тренировки на две строки (убираем имя)
  const splitWorkoutName = (name: string) => {
    const parts = name.split(' / ');
    if (parts.length >= 2) {
      const title = parts[0].trim();
      let subtitle = '';
      if (parts.length > 2) {
        // Убираем последний элемент (обычно имя преподавателя)
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
    <div className={styles.overlay}>
      <div className={styles.container}>
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

export default WorkoutChoice;