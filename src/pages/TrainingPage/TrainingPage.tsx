// src/pages/TrainingPage/TrainingPage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getWorkoutById, getWorkoutProgress } from "../../api/workouts";
import Header from "../../components/Header/Header";
import { splitWorkoutName } from "../../utils/splitWorkoutName";
import type {
  Workout,
  WorkoutProgressResponse,
} from "../../types/course.types";
import styles from "./TrainingPage.module.css";
import { formatExerciseName } from "../../utils/formatExerciseName";
import Loader from '../../components/Loader/Loader';

interface TrainingPageProps {
  openAuthModal: () => void;
}

const TrainingPage: React.FC<TrainingPageProps> = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const { courseId, workoutId } = useParams<{
    courseId: string;
    workoutId: string;
  }>();
  const { user, logout } = useAuth();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [progress, setProgress] = useState<WorkoutProgressResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!workoutId || !courseId) {
        setError("Недостаточно параметров");
        setLoading(false);
        return;
      }
      try {
        const workoutData = await getWorkoutById(workoutId);
        setWorkout(workoutData);
        if (user) {
          try {
            const progressData = await getWorkoutProgress(courseId, workoutId);
            setProgress(progressData);
          } catch {
            // прогресс не найден
          }
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ошибка загрузки тренировки",
        );
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [workoutId, courseId, user]);

  const handleProfileClick = () => navigate("/profile");
  const handleAddCourse = () => navigate("/");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleOpenProgress = () => {
    navigate(`/training/${courseId}/${workoutId}/progress`);
  };

  if (loading) return <Loader fullPage />;
  if (error || !workout)
    return (
      <div className={styles.error}>
        Ошибка: {error || "Тренировка не найдена"}
      </div>
    );

  const { title, subtitle } = splitWorkoutName(workout.name);

  return (
    <div className={styles.page}>
      <Header openAuthModal={openAuthModal} />
      <main className={styles.content}>
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
                const percent = Math.min(
                  Math.round((progressValue / maxQuantity) * 100),
                  100,
                );
                const displayName = formatExerciseName(exercise.name);
                return (
                  <div key={exercise._id} className={styles.exerciseItem}>
                    <p className={styles.exerciseText}>
                      {displayName} ({percent}%)
                    </p>
                    <div className={styles.progressBarBg}>
                      <div
                        className={styles.progressBarFill}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <button
              className={styles.progressButton}
              onClick={handleOpenProgress}
            >
              Заполнить свой прогресс
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TrainingPage;
