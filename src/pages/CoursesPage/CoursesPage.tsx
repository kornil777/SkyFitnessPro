// src/pages/CoursesPage/CoursesPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import CourseCard from "../../components/CourseCard/CourseCard";
import ScrollToTop from "../../components/ScrollToTop/ScrollToTop";
import UserProfile from "../../components/UserProfile/UserProfile";
import { courses } from "../../data/courses";
import styles from "./CoursesPage.module.css";

const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleProfileClick = () => navigate("/profile");
  const handleAddCourse = () => navigate("/");
  const handleLoginClick = () => navigate("/auth");
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.page}>
      <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />

      {isAuthenticated ? (
        <div className={styles.userProfileWrapper}>
          <UserProfile
            userName={user?.name || ""}
            userEmail={user?.email || ""}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
            onAddCourse={handleAddCourse}
          />
        </div>
      ) : (
        <button className={styles.loginButton} onClick={handleLoginClick}>
          Войти
        </button>
      )}

      <p className={styles.subtitle}>Онлайн-тренировки для занятий дома</p>
      <h1 className={styles.title}>
        Начните заниматься спортом
        <br />и улучшите качество жизни
      </h1>
      <img src="/images/Group.svg" alt="Измени своё тело за полгода" className={styles.greenBlock} />

      <div className={styles.coursesGrid}>
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} isAuthenticated={isAuthenticated} />
        ))}
      </div>

      <ScrollToTop />
    </div>
  );
};

export default CoursesPage;