// src/components/CourseCard/CourseCard.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/course.types';
import Icon from '../Icon/Icon';
import styles from './CourseCard.module.css';
import { getCourseImage } from '../../utils/imageMap';

interface CourseCardProps {
  course: Course;
  isAuthenticated?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isAuthenticated = false }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
  navigate(`/course/${course._id}`);
};

  // Маппинг названий курсов к локальным картинкам
  const imageMap: Record<string, string> = {
    'Йога': 'ioga.svg',
    'Стретчинг': 'strech.svg',
    'Фитнес': 'fit.svg',
    'Степ-аэробика': 'step.svg',
    'Бодифлекс': 'body.svg',
  };

  const imageFile = imageMap[course.nameRU] || 'card1.svg';
  const imageUrl = `images/${imageFile}`;

  const durationDays = course.durationInDays || 25;
  const timeFrom = course.dailyDurationInMinutes?.from || 20;
  const timeTo = course.dailyDurationInMinutes?.to || 50;
  const difficulty = course.difficulty || 'Сложность';

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <div className={styles.imageContainer}>
        <img
          src={imageUrl}
          alt={course.nameRU}
          className={styles.image}
          onError={(e) => {
            e.currentTarget.style.background = '#D9D9D9';
          }}
        />
        <Icon />
      </div>

      <div className={styles.contentContainer}>
        <h3 className={styles.title}>{course.nameRU}</h3>

        <div className={styles.firstRow}>
          <img
            src="images/25day.svg"
            alt="25 дней"
            className={styles.daysIcon}
          />
          <img
            src="images/20min.svg"
            alt="20-50 мин/день"
            className={styles.timeIcon}
          />
        </div>

        <img
          src="images/mult.svg"
          alt="Сложность"
          className={styles.difficultyIcon}
        />
      </div>
    </div>
  );
};

export default CourseCard;