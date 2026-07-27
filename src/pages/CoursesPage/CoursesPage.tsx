// src/pages/CoursesPage/CoursesPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import CourseCard from '../../components/CourseCard/CourseCard';
import ScrollToTop from '../../components/ScrollToTop/ScrollToTop';
import { fetchCourses } from '../../api/courses';
import type { Course } from '../../types/course.types';
import styles from './CoursesPage.module.css';

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки курсов');
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, []);

  if (loading) return <div className={styles.loading}>Загрузка курсов...</div>;
  if (error) return <div className={styles.error}>Ошибка: {error}</div>;

  return (
    <div className={styles.page}>
      <Header />
      
      <main className={styles.content}>
        <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>
        <h1 className={styles.title}>
          Начните заниматься спортом
          <br />и улучшите качество жизни
        </h1>
        <img
          src="/images/Group.svg"
          alt="Измени своё тело за полгода"
          className={styles.greenBlock}
        />

        <div className={styles.coursesGrid}>
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>

        <ScrollToTop />
      </main>
    </div>
  );
};

export default CoursesPage;