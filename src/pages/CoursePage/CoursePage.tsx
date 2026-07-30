// src/pages/CoursePage/CoursePage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchCourseById } from '../../api/courses';
import { addCourseToUser, removeCourseFromUser, checkUserHasCourse } from '../../api/purchases';
import Header from '../../components/Header/Header';
import CourseBanner from '../../components/CourseBanner/CourseBanner';
import Loader from '../../components/Loader/Loader';
import { getCourseImage } from '../../utils/imageMap';
import type { Course } from '../../types/course.types';
import styles from './CoursePage.module.css';

interface CoursePageProps {
  openAuthModal: () => void;
}

const CoursePage: React.FC<CoursePageProps> = ({ openAuthModal }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, logout, refreshUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCourseAdded, setIsCourseAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

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
        if (isAuthenticated && user) {
          const has = await checkUserHasCourse(id);
          setIsCourseAdded(has);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ошибка загрузки курса');
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, isAuthenticated, user]);

  const handleAddCourse = async () => {
    if (!id) return;
    setIsAdding(true);
    try {
      await addCourseToUser(id);
      await refreshUser();
      setIsCourseAdded(true);
    } catch (err) {
      console.error('Ошибка добавления курса:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCourse = async () => {
    if (!id) return;
    try {
      await removeCourseFromUser(id);
      await refreshUser();
      setIsCourseAdded(false);
    } catch (err) {
      console.error('Ошибка удаления курса:', err);
    }
  };

  if (loading) return <Loader fullPage />;
  if (error || !course) return <div className={styles.error}>Ошибка: {error || 'Курс не найден'}</div>;

  return (
    <div className={styles.page}>
      <Header openAuthModal={openAuthModal} />

      <main className={styles.content}>
        <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

        {/* Баннер: десктопная и мобильная версии */}
        <div className={styles.bannerWrapper}>
          <div className={styles.bannerDesktop}>
            <CourseBanner nameRU={course.nameRU} />
          </div>
          <div className={styles.bannerMobile}>
            <img
              src={getCourseImage(course.nameRU)}
              alt={course.nameRU}
              className={styles.mobileCourseImage}
            />
          </div>
        </div>

        <h1 className={styles.courseTitle}>{course.nameRU}</h1>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
          <div className={styles.fittingCards}>
            {course.fitting?.map((item, index) => (
              <div key={index} className={styles.fittingCard}>
                <span className={styles.cardNumber}>{index + 1}</span>
                <p className={styles.cardText}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Направления</h2>
          <div className={styles.directionsBlock}>
            {course.directions?.map((dir, index) => (
              <div key={index} className={styles.directionItem}>
                <span className={styles.directionIcon}>
                  <img src="/images/star.svg" alt="*" />
                </span>
                <span className={styles.directionText}>{dir}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.decorImages}>
          <img src="images/block4.svg" alt="Decorative 1" className={styles.block4} />
          <img src="images/block5.svg" alt="Decorative 2" className={styles.block5} />
        </div>

        <div className={styles.offerWrapper}>
          <div className={styles.offerBlock}>
            <div className={styles.offerContent}>
              <h3 className={styles.offerTitle}>Начните путь <br />к новому телу</h3>
              <ul className={styles.offerDescription}>
                <li>проработка всех групп мышц</li>
                <li>тренировка суставов</li>
                <li>улучшение циркуляции крови</li>
                <li>упражнения заряжают бодростью</li>
                <li>помогают противостоять стрессам</li>
              </ul>

              {isAuthenticated ? (
                isCourseAdded ? (
                  <button
                    className={styles.offerButton}
                    onClick={handleRemoveCourse}
                    disabled={isAdding}
                  >
                    Удалить курс
                  </button>
                ) : (
                  <button
                    className={styles.offerButton}
                    onClick={handleAddCourse}
                    disabled={isAdding}
                  >
                    {isAdding ? 'Добавление...' : 'Добавить курс'}
                  </button>
                )
              ) : (
                <button
                  className={styles.offerButton}
                  onClick={openAuthModal}
                >
                  Войдите, чтобы добавить курс
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePage;