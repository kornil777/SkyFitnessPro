// src/pages/CoursePage/CoursePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchCourseById } from '../../api/courses';
import { getCourseImage } from '../../utils/imageMap';
import type { Course } from '../../types/course.types';
import styles from './CoursePage.module.css';

const CoursePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) {
        setError('ID курса не указан');
        setLoading(false);
        return;
      }
      try {
        const data = await fetchCourseById(id);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки курса');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id]);

  const handleLoginClick = () => navigate('/auth');

  if (loading) return <div className={styles.loading}>Загрузка курса...</div>;
  if (error || !course) return <div className={styles.error}>Ошибка: {error || 'Курс не найден'}</div>;

  const imageUrl = getCourseImage(course.nameRU);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />
        <button className={styles.loginButton} onClick={handleLoginClick}>Войти</button>
      </header>

      <main className={styles.content}>
        <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

        <img src={imageUrl} alt={course.nameRU} className={styles.courseImage} />

        <h1 className={styles.courseTitle}>{course.nameRU}</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
          <ul className={styles.list}>
            {course.fitting?.map((item, index) => (
              <li key={index} className={styles.listItem}>{item}</li>
            ))}
          </ul>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Направления</h2>
          <div className={styles.tags}>
            {course.directions?.map((dir, index) => (
              <span key={index} className={styles.tag}>{dir}</span>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Описание</h2>
          <p className={styles.description}>{course.description}</p>
        </div>

        <div className={styles.offerBlock}>
          <div className={styles.offerContent}>
            <h3 className={styles.offerTitle}>Начните путь <br />к новому телу</h3>
            <p className={styles.offerDescription}>
              проработка всех групп мышц<br />
              тренировка суставов<br />
              улучшение циркуляции крови<br />
              упражнения заряжают бодростью<br />
              помогают противостоять стрессам
            </p>
            <button className={styles.offerButton} onClick={handleLoginClick}>
              Войдите, чтобы добавить курс
            </button>
          </div>
          <div className={styles.decorImages}>
            <img src="/images/block4.svg" alt="Decorative 1" className={styles.block4} />
            <img src="/images/block5.svg" alt="Decorative 2" className={styles.block5} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;