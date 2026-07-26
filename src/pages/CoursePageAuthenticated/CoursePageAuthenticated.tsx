// src/pages/CoursePageAuthenticated/CoursePageAuthenticated.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchCourseById } from "../../api/courses";
import {
  addCourseToUser,
  removeCourseFromUser,
  checkUserHasCourse,
} from "../../api/purchases";
import UserProfile from "../../components/UserProfile/UserProfile";
import { getCourseImage } from "../../utils/imageMap";
import type { Course } from "../../types/course.types";
import styles from "./CoursePageAuthenticated.module.css";

const CoursePageAuthenticated: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCourseAdded, setIsCourseAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) {
        setError("ID курса не указан");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchCourseById(id);
        setCourse(data);
        if (user) {
          const has = await checkUserHasCourse(id);
          setIsCourseAdded(has);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки курса");
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [id, user]);

  const handleProfileClick = () => navigate("/profile");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleAddCourse = async () => {
    if (!id) return;
    setIsAdding(true);
    try {
      await addCourseToUser(id);
      setIsCourseAdded(true);
    } catch (err) {
      console.error("Ошибка добавления курса:", err);
    } finally {
      setIsAdding(false);
    }
  };
  const handleRemoveCourse = async () => {
    if (!id) return;
    try {
      await removeCourseFromUser(id);
      setIsCourseAdded(false);
    } catch (err) {
      console.error("Ошибка удаления курса:", err);
    }
  };

  if (loading) return <div className={styles.loading}>Загрузка курса...</div>;
  if (error || !course)
    return (
      <div className={styles.error}>Ошибка: {error || "Курс не найден"}</div>
    );

  const imageUrl = getCourseImage(course.nameRU);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <img
          src="/images/logo.svg"
          alt="SkyFitnessPro"
          className={styles.logo}
        />
        <div className={styles.userProfileWrapper}>
          <UserProfile
            userName={user?.name || ""}
            userEmail={user?.email || ""}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
            onAddCourse={() => {}}
          />
        </div>
      </header>

      <main className={styles.content}>
        <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>

        <img
          src={imageUrl}
          alt={course.nameRU}
          className={styles.courseImage}
        />

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
                  <img src="/images/star.svg" />
                </span>{" "}
                {/* Позже заменим на картинку */}
                <span className={styles.directionText}>{dir}</span>
              </div>
            ))}
          </div>
        </div>
        

        <div className={styles.offerWrapper}>
          <div className={styles.offerBlock}>
            <div className={styles.offerContent}>
              <h3 className={styles.offerTitle}>
                Начните путь <br />к новому телу
              </h3>
              <p className={styles.offerDescription}>
                <li>
                  проработка всех групп мышц
                  <br />
                </li>
                <li>
                  тренировка суставов
                  <br />
                </li>
                <li>
                  улучшение циркуляции крови
                  <br />
                </li>
                <li>
                  упражнения заряжают бодростью
                  <br />
                </li>
                <li>помогают противостоять стрессам</li>
              </p>
              {isCourseAdded ? (
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
                  {isAdding ? "Добавление..." : "Добавить курс"}
                </button>
              )}
            </div>
            <div className={styles.decorImages}>
              <img
                src="/images/block4.svg"
                alt="Decorative 1"
                className={styles.block4}
              />
              <img
                src="/images/block5.svg"
                alt="Decorative 2"
                className={styles.block5}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CoursePageAuthenticated;
