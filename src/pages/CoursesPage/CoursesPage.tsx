// src/pages/CoursesPage/CoursesPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchCourses } from '../../api/courses';
import { fetchUserData, addCourseToUser, removeCourseFromUser } from '../../api/purchases';
import Header from '../../components/Header/Header';
import CourseCard from '../../components/CourseCard/CourseCard';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import Toast from '../../components/Toast/Toast';
import type { Course } from '../../types/course.types';
import styles from './CoursesPage.module.css';
import Loader from '../../components/Loader/Loader';

interface CoursesPageProps {
  openAuthModal: () => void;
}

const CoursesPage: React.FC<CoursesPageProps> = ({ openAuthModal }) => {
  const { user, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [addedCourseIds, setAddedCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Загрузка курсов и списка добавленных курсов пользователя
  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesData, userData] = await Promise.all([
          fetchCourses(),
          isAuthenticated && user ? fetchUserData() : Promise.resolve(null),
        ]);
        const sorted = coursesData.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCourses(sorted);
        if (userData && userData.selectedCourses) {
          setAddedCourseIds(userData.selectedCourses);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки данных');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, user]);

  const handleToggleCourse = async (courseId: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    const isAdded = addedCourseIds.includes(courseId);
    try {
      if (isAdded) {
        await removeCourseFromUser(courseId);
        setAddedCourseIds(prev => prev.filter(id => id !== courseId));
        setToastMessage('Курс удалён из ваших тренировок');
      } else {
        await addCourseToUser(courseId);
        setAddedCourseIds(prev => [...prev, courseId]);
        setToastMessage('Курс добавлен в ваши тренировки');
      }
      // Автоматически скрыть тост через 3 секунды
      setTimeout(() => setToastMessage(null), 3000);
    } catch (error) {
      console.error('Ошибка при переключении курса:', error);
      setToastMessage('Произошла ошибка, попробуйте позже');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  if (loading) return <Loader fullPage />;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div className={styles.page}>
      <Header openAuthModal={openAuthModal} />
      <main className={styles.content}>
        <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>
        <h1 className={styles.title}>
          Начните заниматься спортом
          <br />и улучшите качество жизни
        </h1>
        <img
          src="images/Group.svg"
          alt="Измени своё тело за полгода"
          className={styles.greenBlock}
        />
        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isAuthenticated={isAuthenticated}
              isAdded={addedCourseIds.includes(course._id)}
              onToggle={handleToggleCourse}
              openAuthModal={openAuthModal} 
            />
          ))}
        </div>
        <ScrollToTop />
        {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} duration={3000} />}
      </main>
    </div>
  );
};

export default CoursesPage;