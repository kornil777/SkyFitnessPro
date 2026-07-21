// src/pages/ProfilePage/ProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserData } from '../../api/purchases';
import UserProfile from '../../components/UserProfile/UserProfile';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import TrainingModal from '../../components/TrainingModal/TrainingModal';
import type { Course } from '../../types/course.types';
import styles from './ProfilePage.module.css';

interface CourseWithProgress extends Course {
  progress: number;
  buttonText: string;
  isDeleted?: boolean;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<CourseWithProgress | null>(null);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  useEffect(() => {
    const loadUserCourses = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const userData = await fetchUserData();
        const courseIds = userData.selectedCourses || [];
        // Здесь нужно получить данные курсов по их ID. 
        // Пока заглушка: создаём моковые курсы на основе ID.
        // В реальности нужно сделать запрос к /api/fitness/courses и отфильтровать.
        // Для демонстрации используем моковые данные (потом заменим на реальные).
        const mockCourses: CourseWithProgress[] = courseIds.map((id, index) => ({
          _id: id,
          nameRU: `Курс ${index + 1}`,
          nameEN: `Course ${index + 1}`,
          description: '',
          directions: [],
          fitting: [],
          difficulty: 'Средний',
          durationInDays: 25,
          dailyDurationInMinutes: { from: 20, to: 50 },
          workouts: [],
          image: 'card1.svg',
          progress: Math.floor(Math.random() * 100),
          buttonText: index === 0 ? 'Продолжить' : 'Начать тренировки',
          isDeleted: false,
        }));
        setCourses(mockCourses);
      } catch (error) {
        console.error('Failed to load user courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUserCourses();
  }, [user]);

  const handleProfileClick = () => navigate('/profile');
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  const handleAddCourse = () => navigate('/');

  const handleDeleteCourse = (courseId: string) => {
    setCourses(prev =>
      prev.map(c => c._id === courseId ? { ...c, isDeleted: !c.isDeleted } : c)
    );
  };

  const handleStartTraining = (course: CourseWithProgress) => {
    setSelectedCourse(course);
    setIsTrainingModalOpen(true);
  };

  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
    setSelectedCourse(null);
  };

  const handleStartSelectedTrainings = (selectedTrainingIds: number[]) => {
    console.log('Selected trainings:', selectedTrainingIds);
    navigate(`/training/${selectedCourse?._id}`);
    setIsTrainingModalOpen(false);
  };

  const userLogin = user?.email ? user.email.split('@')[0] : '';

  if (loading) return <div>Загрузка...</div>;

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
        <h1 className={styles.profileTitle}>Профиль</h1>

        <div className={styles.profileCard}>
          <div className={styles.profileInner}>
            <div className={styles.profileIcon}>
              <img src="/images/Mask.svg" alt="Profile" />
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
                      src={`/images/${course.image || 'card1.svg'}`}
                      alt={course.nameRU}
                      className={styles.courseImage}
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
                      <img src="/images/25day.svg" alt="25 дней" className={styles.daysIcon} />
                      <img src="/images/20min.svg" alt="20-50 мин/день" className={styles.timeIcon} />
                    </div>
                    <img src="/images/mult.svg" alt="Сложность" className={styles.difficultyIcon} />
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

      {selectedCourse && (
        <TrainingModal
          isOpen={isTrainingModalOpen}
          onClose={handleCloseTrainingModal}
          courseTitle={selectedCourse.nameRU}
          onStartTraining={handleStartSelectedTrainings}
        />
      )}
    </div>
  );
};

export default ProfilePage;