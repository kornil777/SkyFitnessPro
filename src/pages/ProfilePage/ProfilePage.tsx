// src/pages/ProfilePage/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserData } from '../../api/purchases';
import { fetchCourses } from '../../api/courses';
import { getCourseProgress } from '../../api/progress';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import WorkoutChoiceModal from '../../components/WorkoutChoiceModal/WorkoutChoiceModal';
import { getCourseImage } from '../../utils/imageMap';
import type { Course } from '../../types/course.types';
import styles from './ProfilePage.module.css';
import Loader from '../../components/Loader/Loader';
import Header from '../../components/Header/Header';

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

  useEffect(() => {
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
            if (progressData && progressData.workoutsProgress) {
              const workouts = progressData.workoutsProgress;
              let totalProgress = 0;
              workouts.forEach((w) => {
                if (w.progressData && w.progressData.length > 0) {
                  const avg = w.progressData.reduce((a, b) => a + b, 0) / w.progressData.length;
                  totalProgress += avg;
                }
                if (w.workoutCompleted) {
                  totalProgress += 100;
                }
              });
              if (workouts.length > 0) {
                const avgProgress = totalProgress / workouts.length;
                progress = Math.min(Math.round(avgProgress), 100);
              }
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
    loadUserCourses();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => c._id === courseId ? { ...c, isDeleted: !c.isDeleted } : c)
    );
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
                        e.currentTarget.src = '/images/card1.svg';
                      }}
                    />
                    <DeleteIcon
                      isDeleted={course.isDeleted || false}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCourse(course._id);
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

      {/* Модалка выбора тренировки */}
      {showWorkoutChoice && selectedCourseId && (
        <WorkoutChoiceModal
          courseId={selectedCourseId}
          onClose={handleCloseWorkoutChoice}
        />
      )}
    </div>
  );
};

export default ProfilePage;