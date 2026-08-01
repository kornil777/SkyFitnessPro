// src/pages/ProfilePage/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserData, removeCourseFromUser } from '../../api/purchases';
import { fetchCourses } from '../../api/courses';
import { getCourseProgress } from '../../api/progress';
import Icon from '../../components/Icon/Icon';
import WorkoutChoiceModal from '../../components/WorkoutChoiceModal/WorkoutChoiceModal';
import { getCourseImage } from '../../utils/imageMap';
import type { Course } from '../../types/course.types';
import styles from './ProfilePage.module.css';
import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header/Header';
import Toast from '../../components/Toast/Toast';

interface CourseWithProgress extends Course {
  progress: number;
  buttonText: string;
  isDeleted?: boolean;
}

interface ProfilePageProps {
  openAuthModal: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWorkoutChoice, setShowWorkoutChoice] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadUserCourses = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    try {
      const userData = await fetchUserData();
      const courseIds = userData.selectedCourses || [];

      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const allCourses = await fetchCourses();
      const userCourses = allCourses.filter(course =>
        courseIds.includes(course._id)
      );

      const coursesWithProgressPromises = userCourses.map(async (course) => {
        let progress = 0;
        try {
          const progressData = await getCourseProgress(course._id);
          const totalWorkouts = course.workouts?.length || 0;

          if (progressData && progressData.workoutsProgress && totalWorkouts > 0) {
            let completedWorkouts = 0;
            progressData.workoutsProgress.forEach(w => {
              if (w.workoutCompleted) completedWorkouts++;
            });
            progress = Math.round((completedWorkouts / totalWorkouts) * 100);
          }
        } catch {
          progress = 0;
        }

        const buttonText = progress > 0 ? 'Продолжить' : 'Начать тренировки';

        return {
          ...course,
          progress,
          buttonText,
          isDeleted: false,
        };
      });

      const coursesWithProgress = await Promise.all(coursesWithProgressPromises);
      setCourses(coursesWithProgress);
    } catch (error) {
      console.error('Failed to load user courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserCourses();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleToggleCourse = async (courseId: string) => {
    try {
      await removeCourseFromUser(courseId);
      setToastMessage('Курс удалён из ваших тренировок');
      await loadUserCourses();
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error('Ошибка при удалении курса:', error);
      setToastMessage('Произошла ошибка, попробуйте позже');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleStartTraining = (course: CourseWithProgress) => {
    setSelectedCourseId(course._id);
    setShowWorkoutChoice(true);
  };

  const handleCloseWorkoutChoice = () => {
    setShowWorkoutChoice(false);
    setSelectedCourseId(null);
  };

  const userLogin = user?.email ? user.email.split('@')[0] : '';

  if (loading) return <Loader fullPage />;

  return (
    <div className={styles.page}>
      <Header openAuthModal={openAuthModal} />

      <div className={styles.contentBlock}>
        <h1 className={styles.profileTitle}>Профиль</h1>

        <div className={styles.profileCard}>
          <div className={styles.profileInner}>
            <div className={styles.profileIcon}>
              <img src="images/Mask.svg" alt="Profile" />
            </div>
            <div className={styles.profileInfo}>
              <h2 className={styles.profileName}>{user?.name || ''}</h2>
              <p className={styles.profileLogin}>Логин: {userLogin}</p>
              <button className={styles.logoutButton} onClick={handleLogout}>Выйти</button>
            </div>
          </div>
        </div>

        <div className={styles.coursesSection}>
          <h2 className={styles.coursesTitle}>Мои курсы</h2>
          <div className={styles.coursesGrid}>
            {courses.length === 0 ? (
              <p>У вас пока нет купленных курсов</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course._id}
                  className={`${styles.courseCard} ${course.isDeleted ? styles.deletedCourse : ''}`}
                >
                  <div className={styles.imageContainer}>
                    <img
                      src={getCourseImage(course.nameRU)}
                      alt={course.nameRU}
                      className={styles.courseImage}
                      onError={(e) => {
                        e.currentTarget.src = 'images/card1.svg';
                      }}
                    />
                    <Icon
                      isAdded={true}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleCourse(course._id);
                      }}
                    />
                  </div>
                  <div className={styles.courseContent}>
                    <h3 className={styles.courseTitle}>{course.nameRU}</h3>
                    <div className={styles.iconsRow}>
                      <img src="images/25day.svg" alt="25 дней" className={styles.daysIcon} />
                      <img src="images/20min.svg" alt="20-50 мин/день" className={styles.timeIcon} />
                    </div>
                    <img src="images/mult.svg" alt="Сложность" className={styles.difficultyIcon} />
                    <div className={styles.progressSection}>
                      <p className={styles.progressText}>Прогресс {course.progress || 0}%</p>
                      <div className={styles.progressBarBg}>
                        <div className={styles.progressBarFill} style={{ width: `${course.progress || 0}%` }} />
                      </div>
                    </div>
                    <button
                      className={`${styles.courseButton} ${course.isDeleted ? styles.disabledButton : ''}`}
                      onClick={() => handleStartTraining(course)}
                      disabled={course.isDeleted}
                    >
                      {course.buttonText}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showWorkoutChoice && selectedCourseId && (
        <WorkoutChoiceModal
          courseId={selectedCourseId}
          onClose={handleCloseWorkoutChoice}
        />
      )}

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} duration={3000} />}
    </div>
  );
};

export default ProfilePage;