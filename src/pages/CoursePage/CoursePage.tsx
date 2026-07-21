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

  if (loading) return <div>Загрузка курса...</div>;
  if (error || !course) return <div>Ошибка: {error || 'Курс не найден'}</div>;

  const imageUrl = getCourseImage(course.nameRU);
  const durationDays = course.durationInDays || 25;
  const timeFrom = course.dailyDurationInMinutes?.from || 20;
  const timeTo = course.dailyDurationInMinutes?.to || 50;
  const difficulty = course.difficulty || 'Сложность';

  return (
    <div className={styles.page}>
      <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />
      <button className={styles.loginButton} onClick={handleLoginClick}>Войти</button>
      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

      <img src={imageUrl} alt={course.nameRU} className={styles.courseImage} />

      <h2 className={`${styles.sectionTitle} ${styles.forYouTitle}`}>Подойдет для вас, если:</h2>
      <div className={styles.blocksRow}>
        <img src="/images/block.svg" alt="Block 1" className={`${styles.block} ${styles.block1}`} />
        <img src="/images/block1.svg" alt="Block 2" className={`${styles.block} ${styles.block2}`} />
        <img src="/images/block2.svg" alt="Block 3" className={`${styles.block} ${styles.block3}`} />
      </div>

      <h2 className={`${styles.sectionTitle} ${styles.directionsTitle}`}>Направления</h2>
      <img src="/images/block3.svg" alt="Directions" className={styles.directionsImage} />

      <div className={styles.offerBlock}>
        <div className={styles.whiteBlock} />
        <div className={styles.textContent}>
          <h3 className={styles.offerTitle}>Начните путь <br />к новому телу</h3>
          <p className={styles.offerDescription}>{course.description || 'Описание курса'}</p>
          <button className={styles.offerButton} onClick={handleLoginClick}>
            Войдите, чтобы добавить курс
          </button>
        </div>
        <img src="/images/block4.svg" alt="Decorative 1" className={styles.block4} />
        <img src="/images/block5.svg" alt="Decorative 2" className={styles.block5} />
      </div>
    </div>
  );
};

export default CoursePage;