// src/pages/ProfilePage/ProfilePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfile from "../../components/UserProfile/UserProfile";
import DeleteIcon from "../../components/DeleteIcon/DeleteIcon";
import TrainingModal from "../../components/TrainingModal/TrainingModal";
import styles from "./ProfilePage.module.css";

interface Course {
  id: number;
  title: string;
  image: string;
  progress: number;
  buttonText: string;
  isDeleted?: boolean;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  const [courses, setCourses] = useState<Course[]>([
    { id: 1, title: "Йога", image: "ioga.svg", progress: 40, buttonText: "Продолжить", isDeleted: false },
    { id: 2, title: "Стретчинг", image: "strech.svg", progress: 75, buttonText: "Начать тренировки", isDeleted: false },
    { id: 3, title: "Фитнес", image: "fit.svg", progress: 100, buttonText: "Начать заново", isDeleted: false },
  ]);

  const handleProfileClick = () => navigate("/profile");
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  const handleAddCourse = () => navigate("/");

  const handleCourseClick = (courseId: number) => {
    const course = courses.find((c) => c.id === courseId);
    if (course && !course.isDeleted) {
      navigate(`/course/${courseId}/authenticated`);
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId ? { ...c, isDeleted: !c.isDeleted } : c
      )
    );
  };

  const handleStartTraining = (course: Course) => {
    setSelectedCourse(course);
    setIsTrainingModalOpen(true);
  };

  const handleCloseTrainingModal = () => {
    setIsTrainingModalOpen(false);
    setSelectedCourse(null);
  };

  const handleStartSelectedTrainings = (selectedTrainingIds: number[]) => {
    console.log("Selected trainings:", selectedTrainingIds);
    navigate(`/training/${selectedCourse?.id}`);
    setIsTrainingModalOpen(false);
  };

  const userLogin = user?.email?.split("@")[0] || "";

  return (
    <div className={styles.page}>
      <img src="/images/logo.svg" alt="SkyFitnessPro" className={styles.logo} />
      <div className={styles.userProfileWrapper}>
        <UserProfile
          userName={user?.name || ""}
          userEmail={user?.email || ""}
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
              <h2 className={styles.profileName}>{user?.name || ""}</h2>
              <p className={styles.profileLogin}>Логин: {userLogin}</p>
              <button className={styles.logoutButton} onClick={handleLogout}>Выйти</button>
            </div>
          </div>
        </div>

        <div className={styles.coursesSection}>
          <h2 className={styles.coursesTitle}>Мои курсы</h2>
          <div className={styles.coursesGrid}>
            {courses.map((course) => (
              <div
                key={course.id}
                className={`${styles.courseCard} ${course.isDeleted ? styles.deletedCourse : ""}`}
              >
                <div className={styles.imageContainer}>
                  <img src={`/images/${course.image}`} alt={course.title} className={styles.courseImage} />
                  <DeleteIcon
                    isDeleted={course.isDeleted}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course.id);
                    }}
                  />
                </div>
                <div className={styles.courseContent}>
                  <h3 className={styles.courseTitle}>{course.title}</h3>
                  <div className={styles.iconsRow}>
                    <img src="/images/25day.svg" alt="25 дней" className={styles.daysIcon} />
                    <img src="/images/20min.svg" alt="20-50 мин/день" className={styles.timeIcon} />
                  </div>
                  <img src="/images/mult.svg" alt="Сложность" className={styles.difficultyIcon} />
                  <div className={styles.progressSection}>
                    <p className={styles.progressText}>Прогресс {course.progress}%</p>
                    <div className={styles.progressBarBg}>
                      <div className={styles.progressBarFill} style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                  <button
                    className={`${styles.courseButton} ${course.isDeleted ? styles.disabledButton : ""}`}
                    onClick={() => handleStartTraining(course)}
                    disabled={course.isDeleted}
                  >
                    {course.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedCourse && (
        <TrainingModal
          isOpen={isTrainingModalOpen}
          onClose={handleCloseTrainingModal}
          courseTitle={selectedCourse.title}
          onStartTraining={handleStartSelectedTrainings}
        />
      )}
    </div>
  );
};

export default ProfilePage;